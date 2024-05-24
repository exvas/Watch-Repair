import frappe
from frappe.utils import nowdate
from frappe import utils

def schedule_jobs():
    frappe.db.sql("""UPDATE `tabService Warranty` SET `status` = 'Out of Warranty' WHERE `warranty_expiry_date` <= %s""", (nowdate()))
    frappe.db.commit()
