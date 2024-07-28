// Copyright (c) 2024, sammish and contributors
// For license information, please see license.txt

frappe.ui.form.on('Daily Closing Entry', {
	refresh: function(frm) {
		// frappe.msgprint("hai")

	},

	// get: function(frm) {
	// 	frappe.call({
	// 		method: 'frappe.client.get_list',
	// 		args: {
	// 			doctype: 'Repair Order',
	// 			filters: {
	// 				'date': frm.doc.posting_date,
	// 				'docstatus': 1  
	// 			},
	// 			fields: ['name', 'status', 'posting_date']  
	// 		},
	// 		callback: function(response) {
	// 			if (response.message) {
	// 				frm.clear_table('daily_closing_entry_repair_order');
	
	// 				let open_count = 0;
	// 				let delivered_count = 0;
					
	
	// 				response.message.forEach(function(repair_order) {
	// 					let row = frm.add_child('daily_closing_entry_repair_order');
	// 					row.repair_order = repair_order.name;
	// 					row.status = repair_order.status;  
	// 					row.date = repair_order.date;  
	
	// 					if (repair_order.status === 'Open') {
	// 						open_count++;
	// 					}
	// 					if (repair_order.status === 'Delivered') {
	// 						delivered_count++;
	// 					}
	
	// 					frappe.call({
	// 						method: 'frappe.client.get',
	// 						args: {
	// 							doctype: 'Repair Order',
	// 							name: repair_order.name
	// 						},
	// 						callback: function(detail_response) {
	// 							let details = detail_response.message;
	// 							// row.job_work = details.job_work;
	// 							// row.servicing = details.servicing;
	
	// 							frm.refresh_field('daily_closing_entry_repair_order');
	// 						}
	// 					});
	// 				});
	
	// 				frm.refresh_field('daily_closing_entry_repair_order');
	
	// 				frm.doc.total = response.message.length;
	// 				frm.refresh_field('total');
	
	// 				frm.doc.open = open_count;
	// 				frm.refresh_field('open');

	// 				frm.doc.deliverd = delivered_count;
	// 				frm.refresh_field('deliverd');
	// 			}
	// 		}
	// 	});
	// },

	// get: function(frm) {
	// 	frappe.call({
	// 		method: 'frappe.client.get_list',
	// 		args: {
	// 			doctype: 'Job Work',
	// 			filters: {
	// 				'date': frm.doc.posting_date,
	// 				// 'docstatus': 1  
	// 			},
	// 			fields: ['name', 'status', 'posting_date']  
	// 		},
	// 		callback: function(response) {
	// 			if (response.message) {
	// 				frm.clear_table('daily_closing_entry_repair_order');
	
	// 				let open_count = 0;
	// 				let delivered_count = 0;
	// 				let toinvoice_count = 0;
	// 				let tocus_app_count = 0;
					
	
	// 				response.message.forEach(function(job_work) {
	// 					let row = frm.add_child('daily_closing_entry_repair_order');
	// 					row.job_work = job_work.name;
	// 					row.status = job_work.status;  
	// 					row.date = job_work.posting_date;
	// 					row.repair_order = job_work.repair_order || ''; 
	// 					// row.repair_order = job_work.repair_order;
	// 					console.log(job_work.repair_order) 
	
	// 					if (job_work.status === 'Open') {
	// 						open_count++;
	// 					}
	// 					if (job_work.status === 'Delivered') {
	// 						delivered_count++;
	// 					}
	// 					if (job_work.status === 'To Invoice') {
	// 						toinvoice_count++;
	// 					}
	// 					if (job_work.status === 'To Customer Approval') {
	// 						tocus_app_count++;
	// 					}
	
	// 					frappe.call({
	// 						method: 'frappe.client.get',
	// 						args: {
	// 							doctype: 'Job Work',
	// 							name: job_work.name
	// 						},
	// 						callback: function(detail_response) {
	// 							let details = detail_response.message;
	// 							row.repair_order = row.repair_order || details.repair_order;
	// 							// row.job_work = details.job_work;
	// 							// row.servicing = details.servicing;
	
	// 							frm.refresh_field('daily_closing_entry_repair_order');
	// 						}
	// 					});
	// 				});
	
	// 				frm.refresh_field('daily_closing_entry_repair_order');
	
	// 				frm.doc.total = response.message.length;
	// 				frm.refresh_field('total');
	
	// 				frm.doc.open = open_count;
	// 				frm.refresh_field('open');

	// 				frm.doc.deliverd = delivered_count;
	// 				frm.refresh_field('deliverd');

	// 				frm.doc.to_invoice = toinvoice_count;
	// 				frm.refresh_field('to_invoice');

	// 				frm.doc.to_customer_approval = tocus_app_count;
	// 				frm.refresh_field('to_customer_approval');
	// 			}
	// 		}
	// 	});
	// },
	



/////////////////////////////////////////////////////////



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
				frm.clear_table('daily_closing_entry_invoice'); // Clear the invoice table as well
				frm.clear_table('daily_closing_entry_advance'); // Clear the advance payment table
				
				let open_count = 0;
				let delivered_count = 0;
				let toinvoice_count = 0;
				let tocus_app_count = 0;
				let paid_total = 0;
				let unpaid_total = 0;

				let total_advance_amount = 0;

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
												}
											}
											frm.refresh_field('daily_closing_entry_invoice');
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
							});
							frm.refresh_field('daily_closing_payout');
						}
					}
				});


				// Wait for all promises to complete
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
				});
			}
		}
	});
},




difference:function(frm){
	frm.doc.grand_toatl = frm.doc.net_total - frm.doc.difference
	frm.refresh_field('grand_toatl');
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
 