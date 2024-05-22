frappe.ui.form.on('Sales Invoice', {
    refresh: function(frm) {
        console.log("sarath");
        frm.add_custom_button(__('Job Work'), function() {
            frm.trigger("add_multi_job_work");
        }, __("Get Items From"));
    },

    add_multi_job_work: function(frm) {
        var d = new frappe.ui.form.MultiSelectDialog({
            doctype: "Job Work",
            target: frm,
            setters: {
                customer: null,
            },
            get_query() {
                let filters = {
                    // docstatus: 0,
                    status: "To Invoice"  // Add the custom field filter here
                };
                return {
                    filters: filters,
                    columns: ['name', 'customer'],
                };
            },
            action(selections) {
                // Process selected job work items
                frappe.call({
                    method: 'watch_repair.doc_events.sales_invoice.get_items',
                    args: {
                        job_work_ids: selections
                    },
                    callback: function(r) {
                        if (r.message) {
                            let items = r.message;

                            // Check if all items are from the same customer
                            let customers = items.map(item => item.customer);
                            let uniqueCustomers = [...new Set(customers)];

                            if (uniqueCustomers.length > 1) {
                                frappe.msgprint(__('Please select Job Work entries from the same customer.'));
                                return;
                            }

                            frm.clear_table("items");

                            if (items.length > 0) {
                                // Assuming all selected Job Work IDs have the same customer
                                let customer = items[0].customer;
                                frm.set_value("customer", customer);
                            }

                            items.forEach(item => {
                                let row = frm.add_child("items");
                                row.item_code = item.service_item;  // Assuming 'service_item' is the field you want to populate
                                row.qty = item.qty || 1;
                                row.uom = item.uom;
                                row.item_name = item.service_item_name;
                                row.description = item.service_item_name;
                                row.custom_name = item.name;  // Assign Job Work ID to custom_name field
                                // Add other fields as necessary
                                // row.custom_name = 'job_work_ids';
                                // row.custom_name = JSON.stringify(selections);
                            });
                            frm.refresh_field('items');
                        } else {
                            frappe.msgprint(__('No items found for the selected Job Work IDs.'));
                        }
                    }
                });
                d.dialog.hide();
            }
        });
    }
});
