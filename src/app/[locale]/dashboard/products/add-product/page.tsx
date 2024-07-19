import CreateProduct from "@/components/dashboard/products/add-new/create-product";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) {
  const data = {
    en: {
      title: "Add Product",
      description: "Edit or add a new product to your store.",
    },
    ar: {
      title: "اضافة منتج",
      description: "تعديل أو اضافة منتج جديد لمتجرك.",
    },
  };

  return data[locale] ?? data.en;
}

const AddProduct = ({ params: { locale } }: { params: { locale: string } }) => {
  setRequestLocale(locale);
  return (
    <div className="my-10 flex flex-col justify-center">
      <CreateProduct />
    </div>
  );
};

export default AddProduct;
