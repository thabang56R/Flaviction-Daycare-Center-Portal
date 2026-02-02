// src/components/common/LanguageSwitcher.jsx
import React from 'react';
import { Box, Select, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next'; // assuming react-i18next is set up

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'af', label: 'Afrikaans' },
    { code: 'tn', label: 'Setswana' },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Tooltip label="Change language" placement="bottom">
      <Select
        size="sm"
        w="140px"
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        variant="filled"
        bg="white"
        borderRadius="full"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </Select>
    </Tooltip>
  );
};

export default LanguageSwitcher;