// Copyright (c) 2024, sammish and contributors
// For license information, please see license.txt

frappe.ui.form.on('Daily Closing Entry', {
	refresh: function(frm) {
		// frappe.msgprint("hai")

	},

    get: function(frm) {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Job Work',
                filters: {
                    'date': frm.doc.posting_date,
                    // 'docstatus': 1  
                },
                fields: ['name', 'status', 'posting_date']  
            },
            callback: function(response) {
                if (response.message) {
                    frm.clear_table('daily_closing_entry_repair_order');
                    frm.clear_table('daily_closing_entry_invoice');
                    frm.clear_table('daily_closing_entry_advance');
                    frm.clear_table('daily_closing_payout');
                    frm.clear_table('daily_closing_payout_jv');
                    frm.clear_table('daily_closing_entry_item_group');
                    frm.clear_table('daily_closing_mop'); // Clear the mode of payment table
    
                    let open_count = 0;
                    let delivered_count = 0;
                    let toinvoice_count = 0;
                    let tocus_app_count = 0;
                    let paid_total = 0;
                    let unpaid_total = 0;
    
                    let total_advance_amount = 0;
                    let total_debit = 0;
                    let total_credit = 0;
                    let total_item_group_amount = 0; // Variable to store the total amount from item groups
                    let total_mop_amount = 0; // Variable to store the total mode of payment amount
    
                    let promises = []; // Store promises for async calls
    
                    response.message.forEach(function(job_work) {
                        let row = frm.add_child('daily_closing_entry_repair_order');
                        row.job_work = job_work.name;
                        row.status = job_work.status;  
                        row.date = job_work.posting_date;
                        row.repair_order = job_work.repair_order || ''; 
                        console.log(job_work.repair_order);
    
                        if (job_work.status === 'Open') {
                            open_count++;
                        }
                        if (job_work.status === 'Delivered') {
                            delivered_count++;
                        }
                        if (job_work.status === 'To Invoice') {
                            toinvoice_count++;
                        }
                        if (job_work.status === 'To Customer Approval') {
                            tocus_app_count++;
                        }
    
                        let detail_promise = frappe.call({
                            method: 'frappe.client.get',
                            args: {
                                doctype: 'Job Work',
                                name: job_work.name
                            },
                            callback: function(detail_response) {
                                let details = detail_response.message;
                                row.repair_order = row.repair_order || details.repair_order;
                                frm.refresh_field('daily_closing_entry_repair_order');
                            }
                        });
                        promises.push(detail_promise);
    
                        // Fetch related Sales Invoices
                        let invoice_promise = frappe.call({
                            method: 'frappe.client.get_list',
                            args: {
                                doctype: 'Sales Invoice',
                                filters: {
                                    'custom_job_work': job_work.name
                                },
                                fields: ['name', 'posting_date', 'grand_total', 'status'] // Removed item_group
                            },
                            callback: function(invoice_response) {
                                if (invoice_response.message) {
                                    invoice_response.message.forEach(function(invoice) {
                                        let invoice_row = frm.add_child('daily_closing_entry_invoice');
                                        invoice_row.sales_invoice = invoice.name;
                                        invoice_row.date = invoice.posting_date;
                                        invoice_row.amount = invoice.grand_total;
                                        invoice_row.status = invoice.status;
    
                                        if (invoice.status === 'Paid') {
                                            paid_total += invoice.grand_total;
                                        }
    
                                        if (invoice.status === 'Overdue' || invoice.status === 'Unpaid') {
                                            unpaid_total += invoice.grand_total;
                                        }
    
                                        // Fetch the item_group from the items table
                                        let item_promise = frappe.call({
                                            method: 'frappe.client.get',
                                            args: {
                                                doctype: 'Sales Invoice',
                                                name: invoice.name
                                            },
                                            callback: function(item_response) {
                                                if (item_response.message) {
                                                    let items = item_response.message.items;
                                                    if (items && items.length > 0) {
                                                        invoice_row.item_group = items[0].custom_item_groups || '';
    
                                                        // Add item group details to the new table
                                                        let item_group_row = frm.add_child('daily_closing_entry_item_group');
                                                        item_group_row.item_group = items[0].custom_item_groups || '';
                                                        item_group_row.amount = items[0].amount || 0;
    
                                                        // Accumulate the total amount
                                                        total_item_group_amount += items[0].amount ;
                                                    }
                                                    console.log("xxxxxxxx", total_item_group_amount);
                                                }
                                                frm.refresh_field('daily_closing_entry_invoice');
                                                frm.refresh_field('daily_closing_entry_item_group');
                                            }
                                        });
                                        promises.push(item_promise);
                                    });
                                }
                            }
                        });
                        promises.push(invoice_promise);
                    });
    
                    // Fetch Payment Entries
                    let payment_promise = frappe.call({
                        method: 'frappe.client.get_list',
                        args: {
                            doctype: 'Payment Entry',
                            filters: {
                                'posting_date': frm.doc.posting_date,
                                'custom_repair_order': ['!=', '']
                            },
                            fields: ['name', 'posting_date', 'paid_amount', 'mode_of_payment', 'custom_repair_order']
                        },
                        callback: function(payment_response) {
                            if (payment_response.message) {
                                payment_response.message.forEach(function(payment) {
                                    let payment_row = frm.add_child('daily_closing_entry_advance');
                                    payment_row.date = payment.posting_date;
                                    payment_row.payment = payment.name;
                                    payment_row.paid_amount = payment.paid_amount;
                                    payment_row.mode_of_payment = payment.mode_of_payment;
    
                                    total_advance_amount += payment.paid_amount;
                                });
                                frm.refresh_field('daily_closing_entry_advance');
                            }
                        }
                    });
                    promises.push(payment_promise);
    
                    let journal_promise = frappe.call({
                        method: 'frappe.client.get_list',
                        args: {
                            doctype: 'Journal Entry',
                            filters: {
                                'posting_date': frm.doc.posting_date,
                                'custom_pay_out': 1
                            },
                            fields: ['name', 'posting_date', 'total_debit']
                        },
                        callback: function(journal_response) {
                            if (journal_response.message) {
                                journal_response.message.forEach(function(journal) {
                                    let journal_row = frm.add_child('daily_closing_payout');
                                    journal_row.date = journal.posting_date;
                                    journal_row.journal_entry = journal.name;
                                    journal_row.total_debit = journal.total_debit;
                                    total_debit += journal.total_debit; 
                                });
                                frm.refresh_field('daily_closing_payout');
                            }
                        }
                    });
                    promises.push(journal_promise);
    
                    let journal_promises = frappe.call({
                        method: 'frappe.client.get_list',
                        args: {
                            doctype: 'Journal Entry',
                            filters: {
                                'posting_date': frm.doc.posting_date,
                                'custom_pay_out': 1
                            },
                            fields: ['name', 'posting_date', 'total_credit']
                        },
                        callback: function(journal_response) {
                            if (journal_response.message) {
                                journal_response.message.forEach(function(journals) {
                                    let journal_rows = frm.add_child('daily_closing_payout_jv');
                                    journal_rows.date = journals.posting_date;
                                    journal_rows.journal_entry = journals.name;
                                    journal_rows.total_credit = journals.total_credit;
                                    total_credit += journals.total_credit; 
                                });
                                frm.refresh_field('daily_closing_payout_jv');
                            }
                        }
                    });
                    promises.push(journal_promises);
    
                    // Fetch Payment Entry Mode of Payment and Amount
                    let mop_promise = frappe.call({
                        method: 'frappe.client.get_list',
                        args: {
                            doctype: 'Payment Entry',
                            filters: {
                                'posting_date': frm.doc.posting_date
                            },
                            fields: ['mode_of_payment', 'paid_amount']
                        },
                        callback: function(mop_response) {
                            if (mop_response.message) {
                                mop_response.message.forEach(function(entry) {
                                    let mop_row = frm.add_child('daily_closing_mop');
                                    mop_row.mode_of_payment = entry.mode_of_payment;
                                    mop_row.amount = entry.paid_amount;
                                    total_mop_amount += entry.paid_amount; // Accumulate the total amount from mode of payment
                                });
                                frm.refresh_field('daily_closing_mop');
                            }
                        }
                    });
                    promises.push(mop_promise);
    
                    Promise.all(promises).then(() => {
                        frm.doc.total = response.message.length;
                        frm.refresh_field('total');
    
                        frm.doc.open = open_count;
                        frm.refresh_field('open');
    
                        frm.doc.deliverd = delivered_count;
                        frm.refresh_field('deliverd');
    
                        frm.doc.to_invoice = toinvoice_count;
                        frm.refresh_field('to_invoice');
    
                        frm.doc.to_customer_approval = tocus_app_count;
                        frm.refresh_field('to_customer_approval');
    
                        frm.doc.paid = paid_total;
                        frm.refresh_field('paid');
    
                        frm.doc.unpaid = unpaid_total; 
                        frm.refresh_field('unpaid');
    
                        frm.doc.total_advance_amount = total_advance_amount; 
                        frm.refresh_field('total_advance_amount');
    
                        frm.doc.total_debit = total_debit;
                        frm.refresh_field('total_debit');
    
                        frm.doc.total_credit = total_credit;
                        frm.refresh_field('total_credit');
    
                        frm.doc.total_amount = total_item_group_amount;
                        frm.refresh_field('total_amount');
                        
                        frm.doc.total_amount1 = total_mop_amount; // Set the accumulated mode of payment amount
                        frm.refresh_field('total_amount1');
    
                        console.log("kkkkk", total_item_group_amount);
                    });
                }
            }
        });
    },
    

    
    



















difference:function(frm){
	frm.doc.grand_total = frm.doc.net_total - frm.doc.difference
	frm.refresh_field('grand_total');
},

grand_total:function(frm){
	frm.doc.difference = frm.doc.net_total - frm.doc.grand_total
	frm.refresh_field('difference');
}
	
	





});


frappe.ui.form.on('Daily Closing Physical', {


	currency: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];  
        row.total = row.denomination * row.currency;
        frm.refresh_field('daily_closing_physical');
		update_net_total(frm);
    },

	denomination: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];  
        row.total = row.denomination * row.currency;
        frm.refresh_field('daily_closing_physical');
		update_net_total(frm);
    },
})
function update_net_total(frm) {
    let net_total = 0;
    frm.doc.daily_closing_physical.forEach(function(row) {
        net_total += row.total || 0;
    });
    frm.set_value('net_total', net_total);
}
 