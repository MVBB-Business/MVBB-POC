/**
 * Hand-written stopgap matching backend/supabase/migrations/0001_init.sql.
 * Replace with `supabase gen types typescript --project-id rnyaucgyxnzshcoqesvk`
 * once the Supabase CLI is set up with an access token — that command
 * generates this file from the live schema instead of relying on someone
 * keeping it in sync by hand.
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          phone: string;
          name: string | null;
          account_type: "B2B" | "B2C";
          business_name: string | null;
          is_hawker: boolean;
          credit_balance: number;
          credit_limit: number;
          status: string;
          created_at: string;
        };
      };
      grades: {
        Row: {
          id: string;
          category: string;
          label: string;
          tagline: string | null;
          description: string | null;
          quality: string | null;
          bulb_size: string | null;
          cloves: string | null;
          moisture: string | null;
          shelf_life: string | null;
          origin: string | null;
          export_grade: boolean;
          best_seller: boolean;
          color: string | null;
          bag_weight_kg: number;
          cost_per_bag: number;
          stock_bags: number;
          low_stock_threshold: number;
          tiers: { min: number; price: number }[];
          created_at: string;
        };
      };
      drivers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          vehicle: "bike" | "auto" | "mini_truck" | "truck";
          plate: string | null;
          status: "offline" | "available" | "on_delivery" | "deactivated";
          created_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          invoice_no: string;
          customer_id: string | null;
          customer_name: string | null;
          customer_phone: string | null;
          customer_account_type: "B2B" | "B2C";
          status: "Packed" | "Out for delivery" | "Delivered" | "Cancelled";
          order_source: string;
          items: { gradeId: string; name: string; qty: number; unit: number; lineTotal: number; negotiated: boolean }[];
          subtotal: number;
          discount: number;
          delivery_fee: number;
          total: number;
          address: Record<string, unknown> | null;
          pickup_in_store: boolean;
          delivery_slot: string | null;
          payment_method: string | null;
          is_credit_sale: boolean;
          payment_approved: boolean;
          amount_paid: number;
          vehicle_type: "bike" | "auto" | "mini_truck" | "truck" | null;
          total_bags: number;
          assigned_driver_id: string | null;
          placed_at: string;
        };
      };
      khata_entries: {
        Row: {
          id: string;
          user_id: string;
          order_id: string | null;
          type: "sale" | "payment";
          amount: number;
          note: string | null;
          created_at: string;
        };
      };
    };
  };
}
