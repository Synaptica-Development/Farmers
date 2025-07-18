interface Props {
  params: Promise<{ subCategoryID: string, categoryId: string }>;
}

export default async function Subproducts({ params }: Props) {
  const { categoryId, subCategoryID } = await params;
  return <div>categoryId {categoryId} / subCategoryID {subCategoryID}</div>;
}
