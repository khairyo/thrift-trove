import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

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
    <div style={{ 
      width: '200px', 
    }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        color="var(--primary-color)" 
        fontWeight="bold"
        fontFamily='var(--font-family)'
      >
        FILTERS
      </Typography>
      
      <Divider />

      <div style={{ marginTop: '20px' }}>
        <Typography variant="subtitle1" gutterBottom>
          Gender / Age
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={gender.men}
                onChange={handleGenderChange}
                name="men"
              />
            }
            label="Men"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={gender.women}
                onChange={handleGenderChange}
                name="women"
              />
            }
            label="Women"
          />
        </FormGroup>
      </div>

      <Divider style={{ marginTop: '20px', marginBottom: '20px' }} />

      <div>
        <Typography variant="subtitle1" gutterBottom>
          Clothing Type
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={clothingType.tops}
                onChange={handleClothingTypeChange}
                name="tops"
              />
            }
            label="Tops"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={clothingType.bottoms}
                onChange={handleClothingTypeChange}
                name="bottoms"
              />
            }
            label="Bottoms"
          />
        </FormGroup>
      </div>
    </div>
  );
};

export default Filters;
