export const patterns = {
  alphabetical_pattern: /^[a-zA-Z \-\']+/,
  email_pattern: /^\w+([\.\-\+]?\w*)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  mobile_number_pattern: /^((\\+91-?)|0)?[0-9]{10}$/,
  alpha_numeric_special_chars_pattern:
    /^[A-Za-z0-9_@.#$=!%^)(\]:\*;\?\/\,}{'\|<>\[&\+-]*$/,
};
