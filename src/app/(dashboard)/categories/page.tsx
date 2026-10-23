import { getCategories } from '@/app/actions/categories';
import { CategoryList } from '@/components/categories/category-list';
import { CategoryModal } from '@/components/categories/category-modal';

export const revalidate = 0;

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kategori Transaksi</h1>
          <p className="text-sm text-slate-500">Kelola kategori pemasukan dan pengeluaran usaha</p>
        </div>
        <CategoryModal />
      </div>
      <CategoryList initialCategories={categories || []} />
    </div>
  );
}
