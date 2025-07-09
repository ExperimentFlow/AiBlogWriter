import { CheckoutConfiguration } from '../types';

// Sample checkout configuration
export const defaultCheckoutConfig: CheckoutConfiguration = {
  checkoutConfig: {
    id: "checkout_001",
    name: "E-commerce Checkout",
    version: "1.0.0",
    type: "single_page",
    enableHeader: false,
    theme: {
      colorScheme: "dark",
      primaryColor: "#007bff",
      secondaryColor: "#a0a0a0",
      accentColor: "#28a745",
      backgroundColor: "#1a1a1a",
      textColor: "#ffffff",
      errorColor: "#ff6b6b",
      successColor: "#51cf66",
      warningColor: "#ffd43b",
      borderColor: "#404040",
      borderRadius: "8px",
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
    },
    layout: {
      type: 'two_column', // 'one_column' | 'two_column'
      twoColumn: {
        gap: 32,
        rightColumn: {
          content: 'product_info',
          width: '40%'
        },
        leftColumn: {
          content: 'customer_info',
          width: '60%'
        }
      },
      oneColumn: {
        backgroundColor: '#1a1a1a', 
        borderColor: '#e5e7eb',   
        borderStyle: 'solid',    
        borderWidth: 1,          
        borderRadius: 8,         
        order: 'product_first'      // 'customer_first' | 'product_first'
      }
    },
    progressBar: {
      type: "progress_bar", // "progress_bar", "step_indicators", "breadcrumb", "dots", "numbers", "timeline"
      position: "top",
      showStepNames: true,
      showStepNumbers: true,
      showStepDescriptions: false,
      styling: {
        backgroundColor: "#404040",
        completedColor: "#007bff",
        activeColor: "#007bff",
        inactiveColor: "#a0a0a0",
        textColor: "#ffffff",
        height: "8px",
        borderRadius: "4px",
        fontSize: "14px",
        fontWeight: "500",
        gap: "16px",
        padding: "16px",
        borderColor: "#404040",
        borderWidth: "2px",
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowBlur: "4px",
        iconSize: "32px",
      },
    },
    stepMode: false,
    animation: {
      enabled: true,
      duration: "300ms",
      easing: "ease-in-out",
      transitions: ["fade", "slide", "scale"],
    },
  },
  steps: [
    {
      id: "customer-info",
      title: "Customer Information",
      description: "Please provide your contact details",
      sections: [
        {
          id: "personal-info",
          title: "Personal Information",
          fields: [
            {
              id: "firstName",
              type: "text",
              label: "First Name",
              placeholder: "Enter your first name",
              required: true,
              validation: {
                type: "required",
                message: "First name is required"
              }
            },
            {
              id: "lastName",
              type: "text",
              label: "Last Name",
              placeholder: "Enter your last name",
              required: true,
              validation: {
                type: "required",
                message: "Last name is required"
              }
            },
            {
              id: "email",
              type: "email",
              label: "Email Address",
              placeholder: "Enter your email address",
              required: true,
              validation: {
                type: "email",
                message: "Please enter a valid email address"
              }
            }
          ]
        }
      ]
    },
    // {
    //   id: "addons",
    //   title: "Add-ons & Extras",
    //   description: "Enhance your order with additional products and services",
    //   sections: [
    //     {
    //       id: "product-addons",
    //       title: "Product Add-ons",
    //       addons: [
    //         {
    //           id: "warranty",
    //           name: "Extended Warranty",
    //           description: "3-year extended warranty coverage",
    //           price: 29.99,
    //           type: "service",
    //           category: "protection",
    //           image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=80&h=80&fit=crop&crop=center"
    //         },
    //         {
    //           id: "case",
    //           name: "Premium Case",
    //           description: "High-quality protective case",
    //           price: 19.99,
    //           type: "product",
    //           category: "accessories",
    //           image: "https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=80&h=80&fit=crop&crop=center"
    //         },
    //         {
    //           id: "screen-protector",
    //           name: "Screen Protector",
    //           description: "Tempered glass screen protection",
    //           price: 9.99,
    //           type: "product",
    //           category: "accessories",
    //           image: "https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=80&h=80&fit=crop&crop=center"
    //         }
    //       ],
    //       displayType: "cards",
    //       maxSelections: 3
    //     },
    //     {
    //       id: "service-addons",
    //       title: "Service Add-ons",
    //       addons: [
    //         {
    //           id: "express-shipping",
    //           name: "Express Shipping",
    //           description: "Next-day delivery",
    //           price: 15.99,
    //           type: "service",
    //           category: "shipping",
    //           required: false
    //         },
    //         {
    //           id: "gift-wrapping",
    //           name: "Gift Wrapping",
    //           description: "Beautiful gift wrapping service",
    //           price: 4.99,
    //           type: "service",
    //           category: "packaging",
    //           required: false
    //         },
    //         {
    //           id: "installation",
    //           name: "Professional Installation",
    //           description: "Expert setup and installation",
    //           price: 49.99,
    //           type: "service",
    //           category: "installation",
    //           required: false
    //         }
    //       ],
    //       displayType: "list",
    //       maxSelections: 2
    //     }
    //   ]
    // },
    // {
    //   id: "shipping",
    //   title: "Shipping Information",
    //   description: "Where should we deliver your order?",
    //   sections: [
    //     {
    //       id: "shipping-address",
    //       title: "Shipping Address",
    //       fields: [
    //         {
    //           id: "address",
    //           type: "text",
    //           label: "Street Address",
    //           placeholder: "Enter your street address",
    //           required: true,
    //           validation: {
    //             type: "required",
    //             message: "Address is required"
    //           }
    //         },
    //         {
    //           id: "city",
    //           type: "text",
    //           label: "City",
    //           placeholder: "Enter your city",
    //           required: true,
    //           validation: {
    //             type: "required",
    //             message: "City is required"
    //           }
    //         },
    //         {
    //           id: "zipCode",
    //           type: "text",
    //           label: "ZIP Code",
    //           placeholder: "Enter your ZIP code",
    //           required: true,
    //           validation: {
    //             type: "required",
    //             message: "ZIP code is required"
    //           }
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      id: "payment",
      title: "Payment Information",
      description: "Complete your purchase securely",
      sections: [
        {
          id: "payment-method",
          title: "Payment Method",
          fields: [
            {
              id: "cardNumber",
              type: "text",
              label: "Card Number",
              placeholder: "1234 5678 9012 3456",
              required: true,
              validation: {
                type: "required",
                message: "Card number is required"
              }
            },
            {
              id: "expiryDate",
              type: "text",
              label: "Expiry Date",
              placeholder: "MM/YY",
              required: true,
              validation: {
                type: "required",
                message: "Expiry date is required"
              }
            },
            {
              id: "cvv",
              type: "text",
              label: "CVV",
              placeholder: "123",
              required: true,
              validation: {
                type: "required",
                message: "CVV is required"
              }
            }
          ]
        }
      ]
    }
  ],
  components: {},
  actions: {},
  integrations: {},
  customization: {},
  localization: {},
  security: {},
}; 