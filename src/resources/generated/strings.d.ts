import { Callback, StringMap, TFunction, TFunctionKeys, TFunctionResult, TOptions } from 'i18next';
type StringGroups = 'en' | 'jp';
type Strings = {
  app_name: string;
  cancel: string;
  check_acc_verification_code: string;
  check_pass_reset_code: string;
  code_not_received: string;
  confirm: string;
  confirm_password: string;
  confirm_password_hint: string;
  confirmation_sent_code_to_email: string;
  copyright: string;
  create_acc: string;
  do_login: string;
  do_you_have_acc: string;
  enter_confirmation_code: string;
  forgot_password: string;
  gender: string;
  gender_hint: string;
  gender_kana: string;
  gender_kana_hint: string;
  i_agree_the_terms: string;
  if_you_have_acc: string;
  list_facility: string;
  login: string;
  mail_address: string;
  mail_address_hint: string;
  name: string;
  name_hint: string;
  name_kana: string;
  name_kana_hint: string;
  password: string;
  password_hint: string;
  resend_code: string;
  reset: string;
  reset_password: string;
  tag_line: string;
  tag_line_1: string;
  those_who_have_acc: string;
  lastname: string;
  lastname_kana: string;
  lastname_kana_example: string;
  reserve: string;
};
type GetString<TKeys extends TFunctionKeys = string> = (
  key: TKeys | TKeys[],
  options?: TOptions<StringMap> | string
) => TFunctionResult;
type ChangeLanguage = (lng?: StringGroups, callback?: Callback) => Promise<TFunction>;
export const strings: GetString<keyof Strings>;
export const changeLanguage: ChangeLanguage
