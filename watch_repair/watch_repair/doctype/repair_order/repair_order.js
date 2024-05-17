// Copyright (c) 2024, sammish and contributors
// For license information, please see license.txt

frappe.ui.form.on('Repair Order', {
	refresh: function(frm) {
	  
	  console.log("sarath")
	  
		  frm.set_query('warehouse', function() {
			  return {
				  filters: {
					  company: frm.doc.company
				  }
			  };
		  });
  
	  // Adding 'Close' button
		  frm.add_custom_button(('Close'), function() {
			  // Define the functionality for the 'Close' button here
			  frappe.msgprint(('Close button clicked'));
			  // For example, you can change the status of the document
			  frm.set_value('status', 'Closed');
			  frm.save();
		  });
  
		  // Adding 'Open' button
		  frm.add_custom_button(('Open'), function() {
			  // Define the functionality for the 'Open' button here
			  frappe.msgprint(('Open button clicked'));
			  // For example, you can change the status of the document
			  frm.set_value('status', 'Pending');
			  frm.save();
		  });
	  frm.add_custom_button(('Repair Order'), function() {
			  frappe.msgprint(('Repair Order clicked'));
		  }, 'Create');
  
		  frm.add_custom_button(('Create Service'), function() {
			  frappe.msgprint(('Service clicked'));
		  }, 'Create');
	  
  
  
  
  
	  },
	  company: function(frm) {
		  frm.set_query('warehouse', function() {
			  return {
				  filters: {
					  company: frm.doc.company
				  }
			  };
		  });
		  frm.set_value('warehouse', ''); // Clear the warehouse field when company changes
	  }
  });
 