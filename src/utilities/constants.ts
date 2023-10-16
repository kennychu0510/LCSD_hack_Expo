import { Dimensions, Platform } from 'react-native';

export const LCSD_URL = {
  ENQUIRY: `https://w1.leisurelink.lcsd.gov.hk/leisurelink/application/checkCode.do?flowId=4&lang=EN`,
  BOOKING: `https://w1.leisurelink.lcsd.gov.hk/leisurelink/application/checkCode.do?flowId=1&lang=EN`,
  MAP: 'https://www.smartplay.lcsd.gov.hk/website/en/features/facility-booking.html',
};

export const PATH_NAMES = {
  CHECK_CODE: `/leisurelink/application/checkCode.do` as const,
  TIME_OUT: `/lcsd/leisurelink/common/timeout.jsp` as const,
  SELECT_PAGE: `/lcsd/leisurelink/dispatchFlow.do` as const,
  HKID_PAGE: `/lcsd/leisurelink/dispatchFlow.do` as const,
  TOKEN_FAILED: `lcsd/leisurelink/common/tokenVerifyFailed` as const,
};

export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const USER_AGENT = [
  `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36`,
  `Mozilla/5.0 (iPhone13,2; U; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/602.1`,
  'Mozilla/5.0 (iPhone12,1; U; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/602.1;',
];

export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';
