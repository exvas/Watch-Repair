// Copyright (c) 2024, sammish and contributors
// For license information, please see license.txt


frappe.ui.form.on('Job Work', {
    refresh: function(frm) {
    },
    get_servicing_meterials: function(frm) {
        console.log("hiiii");
        if (frm.doc.customer && frm.doc.service_item && frm.doc.repair_order) {
            cur_frm.call({
                doc: cur_frm.doc,
                method: 'get_linked_data',
                args: {
                    customer: frm.doc.customer,
                    service_item: frm.doc.service_item,
                    repair_order: frm.doc.repair_order
                },
                callback: function(r) {
                    if (r.message) {
                        frm.clear_table("job_work_item");
                        $.each(r.message, function(i, d) {
                            var row = frappe.model.add_child(frm.doc, "Job Work Item", "job_work_item");
                            row.item = d.item;
                            row.item_name = d.item_name;
                            row.qty = d.qty;
                            row.available_qty = d.available_qty;
                            row.valuation_rate = d.valuation_rate;
                        });
                        frm.refresh_field("job_work_item");
                    }
                }
            });
        } else {
            frappe.msgprint("Please fill in Customer, Service Item and Repair Order");
        }
    }
}); 