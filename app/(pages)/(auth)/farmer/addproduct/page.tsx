import { Suspense } from 'react';
import AddProductForm from './AddProductForm';

export default function Page() {
  return (
    <Suspense fallback={<div>იტვირთება...</div>}>
        <AddProductForm />
    </Suspense>
  );
}
