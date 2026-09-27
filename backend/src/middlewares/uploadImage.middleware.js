import createMulter from "../configs/produto.multer.js";

const uploadImage = createMulter({
    folder: 'image',
    allowedTypes: ['image/jpeg', 'image/png'],
    fileSize: 10 * 1024 * 1024
}).single('imagem_produto');

export default uploadImage;