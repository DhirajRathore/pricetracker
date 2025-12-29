"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { addProduct } from "@/app/action";
import { toast } from "sonner";

const AddProductForm = ({ user }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("dsr", e);

    if (!user) {
      setShowModal(true);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("url", url);
    const result = await addProduct(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || "Product tracked successfully!");
      setUrl("");
    }
    setLoading(false);
  };
  return (
    <>
      <form className="w-full max-w-2xl mx-auto" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste product URL (Amazon,Flipkart etc.)"
            className={"h-12 text-base"}
            required
            disabled={loading}
          />

          <Button
            className={"bg-orange-500 hover:bg-orange-600 h-10 sm:h-12 px-8"}
            type="submit"
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Track Price"
            )}
          </Button>
        </div>
      </form>

      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />

    </>
  );
};

export default AddProductForm;
