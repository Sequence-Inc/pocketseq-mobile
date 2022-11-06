type PngImages = 'ic_adaptive' | 'ic_app' | 'splash';
type SvgImages = 'adjustment_horizontal' | 'arrow_left' | 'arrow_path' | 'banknotes' | 'building_office_2' | 'calendar' | 'calendar_days' | 'card_amex' | 'card_discover' | 'card_generic' | 'card_jcb' | 'card_mastercard' | 'card_unionpay' | 'card_visa' | 'check' | 'check_circle' | 'chevron_down' | 'cog_6_tooth' | 'credit_card' | 'flag' | 'heart' | 'home' | 'home_modern' | 'ic_account' | 'ic_caret_right' | 'ic_chat' | 'ic_home' | 'ic_inbox' | 'ic_message' | 'ic_notification' | 'ic_send' | 'inbox' | 'information_circle' | 'logo' | 'logo_backup' | 'logo_mark' | 'logo_primary' | 'magnifying_glass' | 'map' | 'map_pin' | 'minus_circle' | 'photo' | 'plus_circle' | 'share' | 'shield_check' | 'star' | 'tag' | 'user' | 'users' | 'x_mark';
type Images = {
  png: Record<PngImages, any>,
  svg: Record<SvgImages, string>,
};
export const images: Images;
