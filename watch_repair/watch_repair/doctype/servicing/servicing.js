// Copyright (c) 2024, sammish and contributors
// For license information, please see license.txt

frappe.ui.form.on('Servicing', {
	refresh: function(frm) {

        cur_frm.set_query("item", "job_work_item", (frm, cdt, cdn) => {
			let d = locals[cdt][cdn];
            return {
                "filters": {
					"custom_is_customer_item":0,
				}
			}
        })
    },


    
  
});


frappe.ui.form.on('Job Work Item', {


    item: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        if (d.item) {
            cur_frm.call({
                doc: cur_frm.doc,
                method: 'get_item',
                args: {
                    item: d.item,
                },
                callback: function(r) {
                    if (r.message) {
                        frappe.model.set_value(d.doctype,d.name,"available_qty",r.message[0].actual_qty);
                        frappe.model.set_value(d.doctype,d.name,"valuation_rate",r.message[0].valuation_rate);
                        frm.refresh_field('job_work_item');
                    }
                }
            });
        }
    },



});


   