export interface OpenFdaDrug {
  application_number?: string[];
  brand_name?: string[];
  generic_name?: string[];
  manufacturer_name?: string[];
  product_ndc?: string[];
  package_ndc?: string[];
  product_type?: string[];
  route?: string[];
  substance_name?: string[];
  rxcui?: string[];
  spl_id?: string[];
  spl_set_id?: string[];
  pharm_class_epc?: string[];
  pharm_class_cs?: string[];
  pharm_class_moa?: string[];
  unii?: string[];
  is_original_packager?: boolean[];
  [key: string]: unknown;
}

export interface FdaDrugLabel {
  id: string;
  set_id?: string;
  version?: string;
  effective_time?: string;
  openfda?: OpenFdaDrug;

  purpose?: string[];
  indications_and_usage?: string[];
  warnings?: string[];
  do_not_use?: string[];
  ask_doctor?: string[];
  ask_doctor_or_pharmacist?: string[];
  when_using?: string[];
  stop_use?: string[];
  pregnancy_or_breast_feeding?: string[];
  keep_out_of_reach_of_children?: string[];
  dosage_and_administration?: string[];
  dosage_and_administration_table?: string[];
  active_ingredient?: string[];
  inactive_ingredient?: string[];
  storage_and_handling?: string[];
  package_label_principal_display_panel?: string[];
  description?: string[];
  spl_product_data_elements?: string[];
  spl_unclassified_section?: string[];
  [key: string]: unknown;
}

export interface FdaApiResponse {
  meta?: {
    disclaimer: string;
    terms: string;
    license: string;
    last_updated: string;
    results: {
      skip: number;
      limit: number;
      total: number;
    };
  };
  results?: FdaDrugLabel[];
  error?: {
    code: string;
    message: string;
  };
}

export interface NormalizedDrugCard {
  id: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  productType: string;
  routes: string[];
  substances: string[];
  productNdc: string;
  applicationNumber: string;
  isOtc: boolean;
  isRx: boolean;
  hasOpenFda: boolean;
}
