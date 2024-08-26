import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import Breadcrumb from '../Breadcrumb';

require('dotenv').config();

const ProductUpload = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    type: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });

    // Generate a preview URL for the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedPrice = `SGD ${formData.price}`;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in local storage');
      }

      // Create a new FormData object for Cloudinary upload
      const imageData = new FormData();
      imageData.append('file', formData.image); // The image file
      imageData.append('upload_preset', 'thrift-trove'); // Replace with your actual upload preset

      const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;

      // Upload the image to Cloudinary
      const imageUploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        imageData
      );

      const imageUrl = imageUploadResponse.data.secure_url;
      console.log('Image uploaded:', imageUrl);

      // Prepare the product data to send to your backend in the correct order
      const productData = {
        category: formData.category,
        type: formData.type,
        product_url: null,
        image: imageUrl,
        name: formData.name,
        price: formattedPrice,
        description: formData.description,
        uploader_id: 1,  // Assuming uploader_id is 1 for simplicity
      };

      // DEBUG
      console.log('Product data:', productData);

      // Send the product data to your backend
      await axios.post('http://localhost:5000/api/product/create', productData);

      alert('Product created successfully!');
    } catch (error) {
      console.error('Error uploading image or creating product:', error.message);
    }
  };

  const commonTextFieldStyles = {
    marginBottom: '10px',
    width: '100%',
    '& .MuiInputBase-root': {
      fontFamily: 'var(--font-family-text)',
    },
    '& .MuiInputLabel-root': {
      fontFamily: 'var(--font-family-text)',
      color: 'gray',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'gray',
      },
      '&:hover fieldset': {
        borderColor: 'gray',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'gray',
      },
    },
    '& .Mui-focused': {
      color: 'gray',
    },
  };

  const primaryButton = {
    fontFamily: 'var(--font-family-text)',
    backgroundColor: 'var(--primary-color)',
    fontSize: '14px',
    color: 'white',
    textTransform: 'none',
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: 'white',
      color: 'var(--primary-color)',
      border: '1px solid var(--primary-color)',
    },
  };

  return (
    <div style={{ margin: '40px 5% 0 5%' }}>
      <Breadcrumb />
      <form
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        onSubmit={handleSubmit}
      >
        <div style={{ width: '60%', marginLeft: '5%' }}>
          <TextField
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            sx={{
              ...commonTextFieldStyles,
            }}
          />
          <TextField
            label="Price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            fullWidth
            sx={{
              ...commonTextFieldStyles
            }}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
            fullWidth
            sx={{
              ...commonTextFieldStyles
            }}
          />
          <div style={{ width: '100%', marginBottom: '20px', marginTop: '10px' }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" style={{ color: 'black' }}>
                Category
              </FormLabel>
              <RadioGroup
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <FormControlLabel 
                  value="Men" 
                  control={<Radio sx={{ color: 'var(--primary-color)', '&.Mui-checked': { color: 'var(--primary-color)' } }} />} 
                  label="Men" 
                />
                <FormControlLabel 
                  value="Women" 
                  control={<Radio sx={{ color: 'var(--primary-color)', '&.Mui-checked': { color: 'var(--primary-color)' } }} />} 
                  label="Women" 
                />
              </RadioGroup>
            </FormControl>
          </div>

          <div style={{ width: '100%', marginBottom: '10px' }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" style={{ color: 'black' }}>
                Type
              </FormLabel>
              <RadioGroup
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <FormControlLabel 
                  value="Tops" 
                  control={<Radio sx={{ color: 'var(--primary-color)', '&.Mui-checked': { color: 'var(--primary-color)' } }} />} 
                  label="Tops" 
                />
                <FormControlLabel 
                  value="Bottoms" 
                  control={<Radio sx={{ color: 'var(--primary-color)', '&.Mui-checked': { color: 'var(--primary-color)' } }} />} 
                  label="Bottoms" 
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'flex-start', 
          alignItems: 'flex-start', 
          width: '30%', 
          marginRight: '5%', 
          marginLeft: '5%'
        }}>
          <Button
            variant="contained"
            component="label"
            sx={{ ...primaryButton, marginBottom: '10px', width: '100%' }}
          >
            Upload Photo
            <input
              id="file-upload"
              type="file"
              onChange={handlePhotoUpload}
              hidden
              required
            />
          </Button>
          {imagePreview && (
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ width: '100%', marginBottom: '10px' }} 
            />
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ ...primaryButton, width: '100%' }}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductUpload;
