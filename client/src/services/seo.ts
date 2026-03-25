export function updateMeta(meta: Record<string,string>) {
  Object.entries(meta).forEach(([key, value]) => {
    const el = document.querySelector(`meta[name="${key}"]`);
    if (el) {
      el.setAttribute('content', value);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = key;
      newMeta.content = value;
      document.head.appendChild(newMeta);
    }
  });
}

export function updateMetaProperty(property: string, value: string) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

export function setSeo({
  title,
  description,
  image,
  url,
  keywords,
}: {
  title: string;
  description: string;
  image?: string;
  url?: string;
  keywords?: string;
}) {
  if (title) {
    document.title = title;
    const titleElement = document.getElementById('page-title');
    if (titleElement) {
      titleElement.textContent = title;
    }
    updateMetaProperty('og:title', title);
    updateMeta({ 'twitter:title': title });
  }

  if (description) {
    updateMeta({ description });
    updateMetaProperty('og:description', description);
    updateMeta({ 'twitter:description': description });
  }

  if (image) {
    updateMetaProperty('og:image', image);
    updateMeta({ 'twitter:image': image });
  }

  if (url) {
    updateMetaProperty('og:url', url);
  }

  if (keywords) {
    updateMeta({ keywords });
  }
}

