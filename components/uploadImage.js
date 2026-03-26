export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.imageUrl; // Cloudinary URL
}
