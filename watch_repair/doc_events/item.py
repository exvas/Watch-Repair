

# import frappe

# @frappe.whitelist()
# def get_categories(item_group):
#     categories = []
#     item_group_doc = frappe.get_doc('Item Group', item_group)
#     if item_group_doc and item_group_doc.custom_category_table:
#         for entry in item_group_doc.custom_category_table:
#             categories.append(entry.category)
#     return categories


import frappe

@frappe.whitelist()
def get_categories(item_group):
    categories = []
    item_group_doc = frappe.get_doc('Item Group', item_group)
    if item_group_doc and item_group_doc.custom_category_table:
        for entry in item_group_doc.custom_category_table:
            categories.append(entry.category)
    return categories
