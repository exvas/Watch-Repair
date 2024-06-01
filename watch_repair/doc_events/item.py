# # /home/sarath/frappe-bench14/apps/watch_repair/watch_repair/doc_events/item.py

# import frappe
# from frappe import _

# @frappe.whitelist()
# def get_categories_for_item_group(doctype, txt, searchfield, start, page_len, filters):
#     item_group = filters.get('item_group')

#     # Fetch the Item Group document
#     item_group_doc = frappe.get_doc('Item Group', item_group)

#     # Get categories from the child table 'Category Table' if it exists
#     category_table = item_group_doc.get('category_table')
#     if category_table:
#         # Extract categories from the child table
#         categories = [row.category for row in category_table]

#         # Prepare the query to get the categories
#         return frappe.db.sql("""
#             SELECT * from `tabItem Group`
#                 doc.item_group = name
#             Left Join
#                 `tabCategory Table`
#             WHERE
#                 name IN (%s)
#                 AND (`name` LIKE %s OR `category` LIKE %s)
#             ORDER BY
#                 idx DESC
#             LIMIT %s, %s
#         """ % (', '.join(['%s'] * len(categories)), '%s', '%s', '%s', '%s'),
#         tuple(categories) + ('%%%s%%' % txt, '%%%s%%' % txt, start, page_len))

#     # Return empty list if category_table is empty or None
#     return []


# /home/sarath/frappe-bench14/apps/watch_repair/watch_repair/doc_events/item.py

# import frappe
# from frappe import _

# @frappe.whitelist()
# def get_categories_for_item_group(doctype, txt, searchfield, start, page_len, filters):
#     item_group = filters.get('item_group')

#     # Fetch the Item Group document
#     item_group_doc = frappe.get_doc('Item Group', item_group)

#     # Get categories from the child table 'Category Table' if it exists
#     category_table = item_group_doc.get('category_table')
#     if category_table:
#         # Extract categories from the child table
#         categories = [row.category for row in category_table]

#         # Prepare the query to get the categories
#         return frappe.db.sql("""
#             SELECT *
#             FROM `tabCategory Table`
#             WHERE category IN (%s)
#                 AND (name LIKE %s OR category LIKE %s)
#             ORDER BY idx DESC
#             LIMIT %s, %s
#         """ % (', '.join(['%s'] * len(categories)), '%s', '%s', '%s', '%s'),
#         tuple(categories) + ('%%%s%%' % txt, '%%%s%%' % txt, start, page_len))

#     # Return empty list if category_table is empty or None
#     return []


# /home/sarath/frappe-bench14/apps/watch_repair/watch_repair/doc_events/item.py

# import frappe

# @frappe.whitelist()
# def get_categories_for_item_group(doctype, txt, searchfield, start, page_len, filters):
#     item_group = filters.get('item_group')

#     # Fetch the Item Group document
#     item_group_doc = frappe.get_doc('Item Group', item_group)

#     # Get categories from the child table 'Category Table' if it exists
#     category_table = item_group_doc.get('category_table')
#     if category_table:
#         # Extract categories from the child table
#         categories = [row.category for row in category_table]

#         # Prepare the query to get the categories
#         return frappe.db.sql("""
#             SELECT `category`
#             FROM `tabCategory Table`
#             WHERE `item_group` = %s
#                 AND (`category` LIKE %s OR `category_name` LIKE %s)
#             ORDER BY `idx` DESC
#             LIMIT %s, %s
#         """, (item_group, '%%%s%%' % txt, '%%%s%%' % txt, start, page_len))

#     # Return empty list if category_table is empty or None
#     return []


import frappe

@frappe.whitelist()
def get_categories_for_item_group(doctype, txt, searchfield, start, page_len, filters):
    item_group = filters.get('item_group')

    # Fetch categories from the child table 'Category Table' based on the selected item_group
    categories = frappe.get_all('Category Table', 
                                 filters={'parent': item_group, 'parenttype': 'Item Group', 'parentfield': 'category_table'},
                                 fields=['category'])

    # Extract category names from the fetched categories
    category_names = [category['category'] for category in categories]

    return category_names
