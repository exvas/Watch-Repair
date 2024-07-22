app_name = "watch_repair"
app_title = "Watch Repair"
app_publisher = "sammish"
app_description = "replace parts, correct timing issues, fix the clock face, clean the watch, and overall repair the instrument to its original status."
app_email = "sammish.thundiyil@gmail.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/watch_repair/css/watch_repair.css"
# app_include_js = "/assets/watch_repair/js/watch_repair.js"

# include js, css files in header of web template
# web_include_css = "/assets/watch_repair/css/watch_repair.css"
# web_include_js = "/assets/watch_repair/js/watch_repair.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "watch_repair/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
doctype_list_js = {"Sales Invoice" : "public/js/sales_invoice.js",
                   "Item" : "public/js/item.js",
                   }
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "watch_repair.utils.jinja_methods",
# 	"filters": "watch_repair.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "watch_repair.install.before_install"
# after_install = "watch_repair.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "watch_repair.uninstall.before_uninstall"
# after_uninstall = "watch_repair.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "watch_repair.utils.before_app_install"
# after_app_install = "watch_repair.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "watch_repair.utils.before_app_uninstall"
# after_app_uninstall = "watch_repair.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "watch_repair.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
    "Sales Invoice": {
        "on_submit": "watch_repair.doc_events.sales_invoice.update_job_work_status",
		"on_cancel": "watch_repair.doc_events.sales_invoice.update_job_work_status_to_invoice",
        "on_trash": "watch_repair.doc_events.sales_invoice.on_trash",
        "on_submit": "watch_repair.doc_events.sales_invoice.disable_items_on_sales_invoice_submit",
        "on_cancel": "watch_repair.doc_events.sales_invoice.enable_items_on_sales_invoice_cancel",

        
	},
    "Stock Entry": {
        "on_cancel":"watch_repair.doc_events.stock_entry.on_cancel_se"
	},
    "Item": {
        
	},
	
}

# Scheduled Tasks
# ---------------

scheduler_events = {
	"all": [
		"watch_repair.schedular.schedule_jobs"
	],
	# "daily": [
	# 	"watch_repair.service_warranty.update_warranty_status"
	# ],
# 	"hourly": [
# 		"watch_repair.tasks.hourly"
# 	],
# 	"weekly": [
# 		"watch_repair.tasks.weekly"
# 	],
# 	"monthly": [
# 		"watch_repair.tasks.monthly"
# 	],
}

# Testing
# -------

# before_tests = "watch_repair.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "watch_repair.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "watch_repair.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["watch_repair.utils.before_request"]
# after_request = ["watch_repair.utils.after_request"]

# Job Events
# ----------
# before_job = ["watch_repair.utils.before_job"]
# after_job = ["watch_repair.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"watch_repair.auth.validate"
# ]
fixtures = [
	{
		"doctype": "Property Setter",
		"filters": [
			[
				"name",
				"in",
				[
					# "Attendance Request-to_date-read_only",
					# "Employee-employment_type-reqd",
					
				]
			]
		]
	},
    {
        "doctype": "Custom Field",
        "filters": [
            [
                "name",
                "in",
                [
					"Stock Entry-custom_job_work",
                    "Sales Invoice-custom_job_work",
                    "Sales Invoice Item-custom_name",
                    "Company-custom_additional_cost",
                    "Company-custom_expense_account",
                    "Item-custom_is_customer_item",
                    "Item-custom_category",
                    "Item Group-custom_category_table",
                    "Payment Entry-custom_repair_order",
                    "Item Group-custom_allow_in_servicing",
                    "Item-custom_allow_in_servicing",
                    "Sales Invoice-custom_repair_order",



				]
			]
		]
	},
]