({
    doInit : function(component, event, helper) {
        component.set("v.meetingRoomInfo", [
            {roomName:'A-01', roomCapacity:'12'},
            {roomName:'A-02', roomCapacity:'16'},
            {roomName:'A-03', roomCapacity:'12'},
            {roomName:'B-01', roomCapacity:'5'},
            {roomName:'B-02', roomCapacity:'8'}
        ]);
    },
    handleTileClick: function(component, event, helper){
        component.set("v.selectedMeetingRoom", event.getParam('roomName'));
    }
})