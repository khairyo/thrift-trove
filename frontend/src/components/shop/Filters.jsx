import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import '../../App.css';

const Filters = ({ onFilterChange }) => {
  const [gender, setGender] = useState({ men: false, women: false });
  const [clothingType, setClothingType] = useState({ tops: false, bottoms: false });

  const handleGenderChange = (event) => {
    const newGender = { ...gender, [event.target.name]: event.target.checked };
    setGender(newGender);
    onFilterChange(newGender, clothingType);
  };

  const handleClothingTypeChange = (event) => {
    const newClothingType = { ...clothingType, [event.target.name]: event.target.checked };
    setClothingType(newClothingType);
    onFilterChange(gender, newClothingType);
  };

  return (
    <div style={{ width: '150px' }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        style={{
          color: 'var(--primary-color)', 
          fontWeight: 'bold',
          fontFamily: 'var(--font-family)',
          marginBottom: '20px',
          fontSize: '18px',
        }}
      >
        FILTERS
      </Typography>
      
      <Divider style={{ marginTop: '10px', marginBottom: '20px', backgroundColor: 'var(--primary-color)' }} />

      <div style={{ marginBottom: '20px' }}>
        <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: 'black', fontSize: '16px' }}>
          Gender
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={gender.men}
                onChange={handleGenderChange}
                name="men"
                sx={{ color: 'var(--primary-color)', '&.Mui-checked': { color: 'var(--primary-color)' } }}
              />
            }
            label="Men"
            style={{ fontSize: '14px', color: 'black', fontWeight: 'normal' }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={gender.women}
                onChange={handleGenderChange}
                name="women"
                sx={{ color: 'var(--primary-color)', '&.Mui-checked': { color: 'var(--primary-color)' } }}
              />
            }
            label="Women"
            style={{ fontSize: '14px', color: 'black', fontWeight: 'normal' }}
          />
        </FormGroup>
      </div>

      <Divider style={{ marginTop: '10px', marginBottom: '20px', backgroundColor: 'var(--primary-color)' }} />

      <div style={{ marginBottom: '20px' }}>
        <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: 'black', fontSize: '16px' }}>
          Clothing Type
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={clothingType.tops}
                onChange={handleClothingTypeChange}
                name="tops"
                sx={{ 
                  color: 'var(--primary-color)',
                  '&.Mui-checked': {
                    color: 'var(--primary-color)',
                  },
                }}
              />
            }
            label="Tops"
            style={{ fontSize: '14px', color: 'black', fontWeight: 'normal' }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={clothingType.bottoms}
                onChange={handleClothingTypeChange}
                name="bottoms"
                sx={{ color: 'var(--primary-color)', '&.Mui-checked': { color: 'var(--primary-color)' } }}
              />
            }
            label="Bottoms"
            style={{ fontSize: '14px', color: 'black', fontWeight: 'normal' }}
          />
        </FormGroup>
      </div>
    </div>
  );
};

export default Filters;
