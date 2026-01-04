"use server";

import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Clean URLs by removing common tracking parameters from any platform
function cleanUrl(url) {
  try {
    const urlObj = new URL(url);
    
    // Common tracking parameters across all e-commerce platforms
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
      'fbclid', 'gclid', 'msclkid',
      'ref', 'dib', 'dib_tag', 'keywords', 'qid', 'sprefix', 'sr', 'aref', 'sp_csd', 'psc',
      'pid', 'lid', 'marketplace', 'q', 'store', 'srno', 'otracker', 'otracker1', 
      'fm', 'iid', 'ppt', 'ppn', 'ssid', 'qH',
      'epid', '_trkparms', '_trksid', 'hash',
      'page', 'sort', 'filter', 'search', 'category', 'variant'
    ];
    
    // Remove all tracking parameters
    trackingParams.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    
    // Return cleaned URL without query string if empty
    const cleanedUrl = urlObj.toString();
    if (cleanedUrl.includes('?')) {
      const [baseUrl, query] = cleanedUrl.split('?');
      return query ? cleanedUrl : baseUrl;
    }
    
    return cleanedUrl;
  } catch (error) {
    // If URL parsing fails, return original URL
    return url;
  }
}


export async function signOut() {
    const supabase=await createClient();
    await supabase.auth.signOut();
    revalidatePath("/");
    redirect("/")
    
}

export async function addProduct(formData) {

    let url=formData.get('url');

    if(!url){
        return {error:"URL is required"};
    }

    // Clean URL to remove tracking parameters
    url = cleanUrl(url);

    try {
        const supabase =await createClient();
        const {data:{user}}= await supabase.auth.getUser();
        if(!user){
            return { error:"Not authenticated"};
        }

        //Scrape product data with Firecrawl

        const productData=await scrapeProduct(url);

        if(!productData.productName || !productData.currentPrice){
            console.log(productData,"productData");
            return { error:"Could not extract product information from this URL"};
        }

        const newPrice =parseFloat(productData.currentPrice);
        const currency=productData.currencyCode || 'USD';
        const {data:existingProduct} =await supabase.from("products")
        .select("id,current_price")
        .eq("user_id",user.id)
        .eq("url",url)
        .single();

        const isUpdate=!!existingProduct;

        //Upsert product (insert or update based on user_id + url)

        const {data:product,error} =await supabase.from("products").upsert({
            user_id:user.id,
            url,
            name:productData.productName,
            current_price:newPrice,
            currency:currency,
            image_url:productData.productImageUrl,
            updated_at: new Date().toISOString(),
        },{
            onConflict:"user_id,url", //Unique constraint on user_id + url
            ignoreDuplicates:false, // Always update if exists
        }).select().single();

        if (error) throw error;

        //Add to price history if its a new product OR price changed

        const shouldAddHistory= !isUpdate || existingProduct.current_price !== newPrice;

        if(shouldAddHistory){
            await supabase.from("price_history").insert({
                product_id:product.id,
                price:newPrice,
                currency:currency
            })
        }

        revalidatePath("/");

        return{
            success:true,
            product,
            message:isUpdate ?
            "Product updated with latest price!":
            "Product added successfully!"
        };
    } catch (error) {

        console.error("Add product error:" ,error);
        return { error:error.message || "Failed to add product"};
        
    }
    
}

export async function deleteProduct(productId) {

    try {
        const supabase = await createClient();
        const {error} = await supabase.from("products")
        .delete()
        .eq("id",productId);

        if(error) throw error;

        revalidatePath("/");
        return {success:true};
        
    } catch (error) {
        return { error:error.message}
    }
    
}

export async function getProducts() {
    
    try {

        const supabase =await createClient();
        
        const {data:{user}} = await supabase.auth.getUser();
        if(!user) return [];

        const{data,error} =await supabase.from("products")
        .select("*")
        .eq("user_id",user.id)
        .order("created_at",{ascending:false});

        if(error) throw error;
        return data||[];
        
    } catch (error) {
        console.error("Get product error:",error);
        return [];
    }
}

export async function getPriceHistory(productId) {
    try {

        const supabase =await createClient();

        const {data,error} =await supabase.from("price_history")
        .select("*")
        .eq("product_id",productId)
        .order("checked_at",{ascending:true});

        if(error) throw error;
        return data || [];
        
    } catch (error) {
        console.log("Get price history error:",error);
        return [];
    }
    
}