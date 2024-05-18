frappe.ui.form.on('Job Work', {
    refresh: function(frm) {
        console.log("sarath");
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
                    // Handle submitted data
                    if (r.message.submitted_data && r.message.submitted_data.length > 0) {
                        frm.clear_table("job_work_item");
                        $.each(r.message.submitted_data, function(i, d) {
                            var row = frappe.model.add_child(frm.doc, "Job Work Item", "job_work_item");
                            row.item = d.item;
                            row.item_name = d.item_name;
                            row.qty = d.qty;
                            row.available_qty = d.available_qty;
                            row.valuation_rate = d.valuation_rate;
                        });
                        frm.refresh_field("job_work_item");
                    }
                    
                    // Handle unsubmitted data
                    if (r.message.unsubmitted_data && r.message.unsubmitted_data.length > 0) {
                        let unsubmitted_names = r.message.unsubmitted_data.map(d => d.name).join(", ");
                        frappe.msgprint(`The Status of The ${unsubmitted_names} Servicing Are Pending. Please submit these document(s).`);
                    }
                }
            });
        } else {
            frappe.msgprint("Please fill in Customer, Service Item and Repair Order");
        }
    }
});
