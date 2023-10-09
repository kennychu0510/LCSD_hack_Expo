import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const useSetHeader = (header: string) => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: header,
    });
  }, []);
};

export default useSetHeader;
