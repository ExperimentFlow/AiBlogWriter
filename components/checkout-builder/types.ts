// Type definitions for the checkout configuration
export interface Validation {
  type?: string;
  message?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  errorMessage?: string;
}

export interface Styling {
  width?: string;
  height?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  fontSize?: string;
  backgroundColor?: string;
  color?: string;
  gap?: string;
  optionPadding?: string;
  optionBorder?: string;
  optionBorderRadius?: string;
  optionBackgroundColor?: string;
  selectedBackgroundColor?: string;
  selectedBorderColor?: string;
  iconSize?: string;
  checkboxSize?: string;
  checkboxColor?: string;
  labelFontSize?: string;
  labelColor?: string;
  itemPadding?: string;
  itemBorder?: string;
  itemBorderRadius?: string;
  itemBackgroundColor?: string;
  containerPadding?: string;
  containerBorder?: string;
  containerBorderRadius?: string;
  containerBackgroundColor?: string;
}

export interface Conditional {
  field: string;
  operator: string;
  value: any;
}

export interface FieldOption {
  value: string;
  label: string;
  description?: string;
  price?: number;
  icon?: string;
}

export interface Field {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: Validation;
  styling?: Styling;
  conditional?: Conditional | null;
  defaultValue?: any;
  columnSpan?: number;
  options?: FieldOption[];
  mask?: string;
}

export interface Section {
  id: string;
  title: string;
  fields?: Field[];
  addons?: Addon[];
  displayType?: 'grid' | 'list' | 'cards';
  maxSelections?: number;
  required?: boolean;
  layout?: string;
  columns?: number;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  sections: Section[];
  order?: number;
  required?: boolean;
  visible?: boolean;
  conditional?: Conditional | null;
}

export interface Theme {
  colorScheme: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  errorColor: string;
  successColor: string;
  warningColor: string;
  borderColor: string;
  borderRadius: string;
  fontFamily: string;
  fontSize: string;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface TwoColumnLayout {
  gap: number;
  leftColumn: {
    content: 'customer_info' | 'product_info';
    width: string;
  };
  rightColumn: {
    content: 'customer_info' | 'product_info';
    width: string;
  };
}

export interface Layout {
  type: 'one_column' | 'two_column';
  twoColumn?: TwoColumnLayout;
  oneColumn?: {
    backgroundColor: string;
    borderColor: string;
    borderStyle: string;
    borderWidth: number;
    borderRadius: number;
    order: 'customer_first' | 'product_first';
  };
}

export interface ProgressBarConfig {
  type: 'progress_bar' | 'step_indicators' | 'breadcrumb' | 'dots' | 'numbers' | 'timeline';
  position: 'top' | 'bottom' | 'left' | 'right';
  showStepNames: boolean;
  showStepNumbers: boolean;
  showStepDescriptions: boolean;
  styling: {
    backgroundColor: string;
    completedColor: string;
    activeColor: string;
    inactiveColor: string;
    textColor: string;
    height: string;
    borderRadius: string;
    fontSize: string;
    fontWeight: string;
    gap: string;
    padding: string;
    borderColor: string;
    borderWidth: string;
    shadowColor: string;
    shadowBlur: string;
    iconSize: string;
  };
}

export interface CheckoutConfig {
  id: string;
  name: string;
  version: string;
  type: string;
  theme: Theme;
  layout: Layout;
  enableHeader: boolean;
  progressBar: ProgressBarConfig;
  stepMode?: boolean;
  animation: {
    enabled: boolean;
    duration: string;
    easing: string;
    transitions: string[];
  };
}

export interface CheckoutConfiguration {
  checkoutConfig: CheckoutConfig;
  steps: Step[];
  components: any;
  actions: any;
  integrations: any;
  customization: any;
  localization: any;
  security: any;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'product' | 'service' | 'upgrade';
  category: string;
  image?: string;
  maxQuantity?: number;
  required?: boolean;
  selected?: boolean;
  quantity?: number;
}

export interface AddonSection {
  id: string;
  title: string;
  description: string;
  addons: Addon[];
  maxSelections?: number;
  required?: boolean;
  displayType: 'grid' | 'list' | 'cards';
} 