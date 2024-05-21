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
                    docstatus: 0,
                };
                return {
                    filters: filters,
                    columns: ['name', 'customer'],
                };
            },
            action(selections) {
                // Process selected job work items
                get_job_work_items(selections, frm);
                d.dialog.hide();
            }
        });
    }
});

function get_job_work_items(selections, frm) {
    frappe.call({
        method: 'watch_repair.doc_events.sales_invoice.get_items',
        args: {
            job_work_ids: selections
        },
        callback: function(r) {
            if (r.message) {
                let items = r.message;
                frm.clear_table("items");
                items.forEach(item => {
                    let row = frm.add_child("items");
                    row.item_code = item.item_code;
                    row.qty = item.qty || 1;
                });
                frm.refresh_field('items');
            }
        }
    });
}
