import { Dimensions } from "react-native";

export const LCSD_URL = {
  ENQUIRY: `https://w1.leisurelink.lcsd.gov.hk/leisurelink/application/checkCode.do?flowId=4&lang=EN`,
  BOOKING: `https://w1.leisurelink.lcsd.gov.hk/leisurelink/application/checkCode.do?flowId=1&lang=EN`,
};

export const PATH_NAMES = {
  CHECK_CODE: `/leisurelink/application/checkCode.do` as const,
  TIME_OUT: `/lcsd/leisurelink/common/timeout.jsp` as const,
  SELECT_PAGE: `/lcsd/leisurelink/dispatchFlow.do` as const,
  HKID_PAGE: `/lcsd/leisurelink/dispatchFlow.do` as const,
  TOKEN_FAILED: `lcsd/leisurelink/common/tokenVerifyFailed` as const,
};

export const SCREEN_HEIGHT = Dimensions.get('window').height