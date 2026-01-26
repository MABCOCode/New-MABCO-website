import { useState, useEffect } from 'react';

export function useProduct(id: string) {
  const [product, setProduct] = useState<any>(null);
  useEffect(() => {
    setProduct({ id });
  }, [id]);
  return product;
}
