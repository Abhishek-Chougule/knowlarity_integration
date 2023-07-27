frappe.ui.form.on('Contact', {

    refresh(frm) {
        console.log("Contact script loaded");
        frm.add_custom_button(__('Knowlarity'), function () {
            frappe.db.get_single_value('Knowlarity Settings', 'enabled').then(function(knowlarity_enabled_name) {
                var fields = [
                    {
                        fieldtype: 'Data',
                        fieldname: 'isselect',
                        label: 'Enter +Country_Code and Mobile No  E.g. +919000008877',
                        default: '+'+(frm.doc.primary_mobile ? frm.doc.primary_mobile : frm.doc.mobile_no),
                    }
                ];
                var fields = [];
                if (knowlarity_enabled_name) {
                    fields.push({
                        fieldtype: 'Button',
                        label: '<img src="https://images.saasworthy.com/tr:w-178,h-0/knowlarity_672_logo_1604302759_o40ev.jpg" style="width:20px; height:20px;">  Knowlarity ',
                        click: function() {
                            var values = d.get_values();
                            if (!values) {
                                // Handle the case where values are not available
                                console.error("Error: Values are not available.");
                                return;
                            }

                            // Access the 'isselect' field value and print it
                            var isselectValue = values.isselect;

                            console.log('isselect field value:', isselectValue);
                            if(isselectValue===''){
                                frappe.call({
                                    method: "knowlarity.api.get_contact",
                                    args: { "userid": frm.doc.email_id },
                                    callback: function(r) {}
                                });

                                frappe.show_alert({
                                    message: __('Calling ...'),
                                    indicator: 'green'
                                }, 10);

                                d.hide();
                            }
                            else{
                                frappe.call({
                                    method: "knowlarity.api.make_call",
                                    args: { "primary_mobile": isselectValue },
                                    callback: function(r) {}
                                });

                                frm.save();
                                frappe.show_alert({
                                    message: __('Calling ...'),
                                    indicator: 'green'
                                }, 10);

                                d.hide();
                            }

                            frappe.call({
                                method: "knowlarity.api.get_contact",
                                args: { "userid": frm.doc.email_id },
                                callback: function(r) {}
                            });

                            frappe.show_alert({
                                message: __('Calling ...'),
                                indicator: 'green'
                            }, 10);

                            d.hide();
                        }
                    });
                }
