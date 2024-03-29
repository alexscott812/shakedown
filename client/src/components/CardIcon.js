import React from 'react';
import { Box, Icon, useStyleConfig } from '@chakra-ui/react';

const CardIcon = ({ icon, ...restProps }) => {
  return (
    <Box __css={useStyleConfig('CardIconBox')} {...restProps}>
      <Icon as={icon} __css={useStyleConfig('CardIcon')} />
    </Box>
    // <Box
    //   boxSize={10}
    //   borderRadius="full"
    //   p={3}
    //   bg={useColorModeValue("brand.50", "whiteAlpha.100")}
    //   d="flex"
    //   alignItems="center"
    //   justifyContent="center"
    //   {...restProps}
    // >
    //   <Icon
    //     as={icon}
    //     boxSize={5}
    //     color={useColorModeValue("brand.600", "brand.200")}
    //   />
    // </Box>
  );
};

export default CardIcon;
