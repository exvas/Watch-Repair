// Copyright (c) 2024, sammish and contributors
// For license information, please see license.txt

frappe.ui.form.on('Servicing', {
	refresh: function(frm) {
    },


    
  
});


frappe.ui.form.on('Job Work Item', {


    item: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        if (child.item) {
            cur_frm.call({
                doc: cur_frm.doc,
                method: 'get_item',
                args: {
                    item: child.item,
                },
                callback: function(r) {
                    if (r.message) {
                        // frappe.model.set_value(cdt, cdn, 'available_qty', r.message);
                        frm.refresh_field('job_work_item');
                    }
                }
            });
        }
    },



});


  