/**
 *
 *
 * DataMember is a class to help you to track on plenty changes.
 *
 * constructor :
 *
 *      Parameters:
 *          * self - this of your environment where you listen to the changes
 *          * dataToMember - List of names of the data to track
 *
 * Public Methods :
 *
 *      startRemember : start to remmber current data from this time.
 *
 *      isChanged : return true or false if some data changes from the last time you run startRemember.
 *
 *      whoChanged : return a list of all data that changed.
 *
 *
 **/


define(['underscore'], function ( _) {

        DataMember = function (self, dataToMember) {

            /** Private Fields **/
            this.dataToMember = dataToMember;
            this.rememberedData = {};

            /** Private Methods **/
            this.fieldChanged = function (newValue) {
                if(newValue.changed !== this.rememberedData["changed"]) {
                    this.rememberedData["isChanged"] = true;
                }

                this.rememberedData["isChanged"] = false;
            };

            this.trimAllFieldsInObjectAndChildren = function(o) {
                return JSON.parse(JSON.stringify(o).replace(/"\s+|\s+"/g, '"'));
            };

            /** Public Methods **/
            this.startRemember = function () {

                // Remember current values and listen to them
                _.each(this.dataToMember, function (field) {
                    this.rememberedData["changed"] = {};
                    this.rememberedData.changed[field] = self.get(field);
                    this.rememberedData["isChanged"] = false;

                    self.on('change:' + field, this.fieldChanged.bind(this));

                }.bind(this));

            };

            this.isChanged = function () {
                var changed = false;

                _.each(this.dataToMember, function (field) {
                    if(field.changed) {
                        changed = true;
                        return;
                    }
                }.bind(this));

                return changed;
            };

            this.whoChanged = function () {
                var changedList = [];

                _.each(this.dataToMember, function (field) {
                    if(field.changed) {
                        changedList.push(field);
                    }
                }.bind(this));

                return changedList;
            };

        };

        return DataMember;
});

