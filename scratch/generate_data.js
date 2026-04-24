const fs = require('fs');
const path = require('path');

const BROKER_ID = 'cada145d-7a99-471c-a4d5-aac9041ba782';
const propertiesPath = path.join(__dirname, '..', 'data', 'properties.json');
const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));

const provinces = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Bình Dương'];
const districts = {
  'Hà Nội': ['Đống Đa', 'Cầu Giấy', 'Nam Từ Liêm', 'Hà Đông', 'Thanh Xuân'],
  'TP. Hồ Chí Minh': ['Quận 1', 'Quận 2', 'Quận 7', 'Quận Bình Thạnh', 'Quận Thủ Đức'],
  'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Liên Chiểu'],
  'Bình Dương': ['Thủ Dầu Một', 'Thuận An', 'Dĩ An']
};
const projects = ['Vinhomes Smart City', 'Vinhomes Ocean Park', 'Masteri West Heights', 'The Sola Park', 'Grand Marina'];
const directions = ['Đông', 'Tây', 'Nam', 'Bắc', 'Đông Bắc', 'Đông Nam', 'Tây Bắc', 'Tây Nam'];
const images = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1460317442991-0ec2193237eb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800&q=80'
];

function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a')
    .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
    .replace(/[íìỉĩị]/g, 'i')
    .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
    .replace(/[úùủũụưứừửữự]/g, 'u')
    .replace(/[ýỳỷỹỵ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

for (let i = 1; i <= 20; i++) {
  const province = provinces[Math.floor(Math.random() * provinces.length)];
  const districtList = districts[province];
  const district = districtList[Math.floor(Math.random() * districtList.length)];
  const project = projects[Math.floor(Math.random() * projects.length)];
  const title = `Căn hộ cao cấp ${project} - ${district}, ${province} (Mã tin ${i})`;
  
  const price = Math.floor(Math.random() * (8000000000 - 2000000000) + 2000000000);
  const area = Math.floor(Math.random() * (120 - 35) + 35);
  
  const newProp = {
    id: Date.now() + i + '',
    brokerId: BROKER_ID,
    title: title,
    slug: slugify(title),
    description: `Thông tin chi tiết căn hộ tại ${project}. Vị trí đắc địa, thuận tiện giao thông. Nội thất đầy đủ, pháp lý rõ ràng. Liên hệ ngay để xem nhà.`,
    project: project,
    price: price,
    area: area,
    bedrooms: (Math.floor(Math.random() * 3) + 1).toString(),
    bathrooms: (Math.floor(Math.random() * 2) + 1).toString(),
    direction: directions[Math.floor(Math.random() * directions.length)],
    balconyDirection: directions[Math.floor(Math.random() * directions.length)],
    propertyStatus: 'Đã bàn giao',
    legalStatus: 'Hợp đồng mua bán',
    furniture: 'Cơ bản',
    images: [images[Math.floor(Math.random() * images.length)]],
    province: province,
    district: district,
    status: 'selling',
    createdAt: new Date().toISOString()
  };
  properties.push(newProp);
}

fs.writeFileSync(propertiesPath, JSON.stringify(properties, null, 2));
console.log('Added 20 properties for broker No Na');
