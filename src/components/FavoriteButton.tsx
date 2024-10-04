import React from 'react';
import { IconButton } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface FavoriteButtonProps {
  favorite: boolean;
  onClick: () => void;
  disabled: boolean
}

// TODO props
const FavoriteButton: React.FC<FavoriteButtonProps> = (props) => {
  const { favorite, onClick, disabled } = props;
  return (
    <IconButton
      disabled={disabled}
      color={favorite ? 'primary' : 'default'}
      onClick={onClick}
    >
      {favorite ? <StarIcon /> : <StarBorderIcon />}
    </IconButton>
  );
}

export default FavoriteButton;
