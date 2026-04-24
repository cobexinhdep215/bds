'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RedirectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const q = id ? `?id=${id}` : '';
    router.push(`/adminmoigioi/dang-tin${q}`);
  }, [id, router]);

  return <div style={{ padding: '40px', textAlign: 'center' }}>Đang chuyển hướng...</div>;
}

export default function PostPropertyRedirect() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <RedirectForm />
    </Suspense>
  );
}
