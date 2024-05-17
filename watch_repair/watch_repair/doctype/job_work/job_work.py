# Copyright (c) 2024, sammish and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class JobWork(Document):
  pass

@frappe.whitelist()
def get_linked_data(doc):
  query = """
    SELECT si.item, si.item_name, si.qty, si.available_qty, si.valuation_rate
    FROM tabJob Work Item s
    INNER JOIN tabServicing si ON si.parent = s.name
    WHERE s.docstatus = 1
    AND s.customer = %s
    AND si.item = %s
    AND s.repair_order = %s
    ORDER BY s.from_date ASC
  """
  data = frappe.db.sql(query, (doc.customer, doc.service_item, doc.repair_order), as_dict=True)
  return data