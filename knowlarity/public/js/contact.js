frappe.ui.form.on('Contact', {

    refresh(frm) {
        console.log("Contact script loaded");
        frm.add_custom_button(__('Knowlarity'), function () {
            frappe.db.get_single_value('Knowlarity Settings', 'enabled').then(function(knowlarity_enabled_name) {
                var fields = [];
                if (knowlarity_enabled_name) {
                    fields.push({
                        fieldtype: 'Button',
                        label: '<img src="https://images.saasworthy.com/tr:w-178,h-0/knowlarity_672_logo_1604302759_o40ev.jpg" style="width:20px; height:20px;">  Knowlarity ',
                        click: function() {
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

                var d = new frappe.ui.Dialog({
                    title: 'Choose Calling Platform',
                    fields: fields
                });

                d.show();
            })
            .catch(function(error) {
                console.log("Error fetching knowlarity_enabled_name:", error);
            });
        }, __("Call"));
    }
});
