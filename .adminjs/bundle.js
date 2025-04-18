(function (React, designSystem) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const Dashboard = () => {
    const handleRedirect = () => {
      window.location.href = "admin/resources/KhokhaEntryModel";
    };
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement("section", {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "32px"
      }
    }, /*#__PURE__*/React__default.default.createElement("p", null, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: "3rem",
        fontWeight: "700"
      }
    }, "GateLog"), /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        fontSize: "3rem",
        fontWeight: "normal",
        color: "#282828"
      }
    }, " ", "Admin"))), /*#__PURE__*/React__default.default.createElement("section", {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "32px"
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "block",
      marginTop: "10px"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "primary",
      onClick: handleRedirect
    }, "Get Logs"))));
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.Dashboard = Dashboard;

})(React, AdminJSDesignSystem);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9hZG1pbl9wYW5lbC91aS9wYWdlcy9kYXNoYm9hcmQuanN4IiwiZW50cnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiB9IGZyb20gXCJAYWRtaW5qcy9kZXNpZ24tc3lzdGVtXCI7XHJcbmltcG9ydCBBZG1pbkpTIGZyb20gXCJhZG1pbmpzXCI7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcclxuICBjb25zdCBoYW5kbGVSZWRpcmVjdCA9ICgpID0+IHtcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID1cclxuICAgICAgXCJhZG1pbi9yZXNvdXJjZXMvS2hva2hhRW50cnlNb2RlbFwiO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8Qm94PlxyXG4gICAgICA8c2VjdGlvblxyXG4gICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcclxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxyXG4gICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcclxuICAgICAgICAgIG1hcmdpblRvcDogXCIzMnB4XCIsXHJcbiAgICAgICAgfX1cclxuICAgICAgPlxyXG4gICAgICAgIDxwPlxyXG4gICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICBmb250U2l6ZTogXCIzcmVtXCIsXHJcbiAgICAgICAgICAgICAgZm9udFdlaWdodDogXCI3MDBcIixcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgR2F0ZUxvZ1xyXG4gICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICBmb250U2l6ZTogXCIzcmVtXCIsXHJcbiAgICAgICAgICAgICAgZm9udFdlaWdodDogXCJub3JtYWxcIixcclxuICAgICAgICAgICAgICBjb2xvcjogXCIjMjgyODI4XCIsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHtcIiBcIn1cclxuICAgICAgICAgICAgQWRtaW5cclxuICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8L3A+XHJcbiAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgPHNlY3Rpb25cclxuICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXHJcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcclxuICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXHJcbiAgICAgICAgICBtYXJnaW5Ub3A6IFwiMzJweFwiLFxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICA8Qm94IGRpc3BsYXk9XCJibG9ja1wiIG1hcmdpblRvcD1cIjEwcHhcIj5cclxuICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cInByaW1hcnlcIiBvbkNsaWNrPXtoYW5kbGVSZWRpcmVjdH0+XHJcbiAgICAgICAgICAgIEdldCBMb2dzXHJcbiAgICAgICAgICA8L0J1dHRvbj5cclxuICAgICAgICA8L0JveD5cclxuICAgICAgPC9zZWN0aW9uPlxyXG4gICAgPC9Cb3g+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZDtcclxuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgRGFzaGJvYXJkIGZyb20gJy4uL2FkbWluX3BhbmVsL3VpL3BhZ2VzL2Rhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGFzaGJvYXJkID0gRGFzaGJvYXJkIl0sIm5hbWVzIjpbIkRhc2hib2FyZCIsImhhbmRsZVJlZGlyZWN0Iiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiQm94Iiwic3R5bGUiLCJkaXNwbGF5IiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwibWFyZ2luVG9wIiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwiY29sb3IiLCJCdXR0b24iLCJ2YXJpYW50Iiwib25DbGljayIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUtPLE1BQU1BLFNBQVMsR0FBR0EsTUFBTTtJQUM3QixNQUFNQyxjQUFjLEdBQUdBLE1BQU07RUFDM0JDLElBQUFBLE1BQU0sQ0FBQ0MsUUFBUSxDQUFDQyxJQUFJLEdBQ2xCLGtDQUFrQyxDQUFBO0tBQ3JDLENBQUE7SUFFRCxvQkFDRUMsc0JBQUEsQ0FBQUMsYUFBQSxDQUFDQyxnQkFBRyxFQUNGRixJQUFBQSxlQUFBQSxzQkFBQSxDQUFBQyxhQUFBLENBQUEsU0FBQSxFQUFBO0VBQ0VFLElBQUFBLEtBQUssRUFBRTtFQUNMQyxNQUFBQSxPQUFPLEVBQUUsTUFBTTtFQUNmQyxNQUFBQSxjQUFjLEVBQUUsUUFBUTtFQUN4QkMsTUFBQUEsVUFBVSxFQUFFLFFBQVE7RUFDcEJDLE1BQUFBLFNBQVMsRUFBRSxNQUFBO0VBQ2IsS0FBQTtFQUFFLEdBQUEsZUFFRlAsc0JBQUEsQ0FBQUMsYUFBQSxDQUNFRCxHQUFBQSxFQUFBQSxJQUFBQSxlQUFBQSxzQkFBQSxDQUFBQyxhQUFBLENBQUEsTUFBQSxFQUFBO0VBQ0VFLElBQUFBLEtBQUssRUFBRTtFQUNMSyxNQUFBQSxRQUFRLEVBQUUsTUFBTTtFQUNoQkMsTUFBQUEsVUFBVSxFQUFFLEtBQUE7RUFDZCxLQUFBO0VBQUUsR0FBQSxFQUNILFNBRUssQ0FBQyxlQUNQVCxzQkFBQSxDQUFBQyxhQUFBLENBQUEsTUFBQSxFQUFBO0VBQ0VFLElBQUFBLEtBQUssRUFBRTtFQUNMSyxNQUFBQSxRQUFRLEVBQUUsTUFBTTtFQUNoQkMsTUFBQUEsVUFBVSxFQUFFLFFBQVE7RUFDcEJDLE1BQUFBLEtBQUssRUFBRSxTQUFBO0VBQ1QsS0FBQTtLQUVDLEVBQUEsR0FBRyxFQUFDLE9BRUQsQ0FDTCxDQUNJLENBQUMsZUFDVlYsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLFNBQUEsRUFBQTtFQUNFRSxJQUFBQSxLQUFLLEVBQUU7RUFDTEMsTUFBQUEsT0FBTyxFQUFFLE1BQU07RUFDZkMsTUFBQUEsY0FBYyxFQUFFLFFBQVE7RUFDeEJDLE1BQUFBLFVBQVUsRUFBRSxRQUFRO0VBQ3BCQyxNQUFBQSxTQUFTLEVBQUUsTUFBQTtFQUNiLEtBQUE7RUFBRSxHQUFBLGVBRUZQLHNCQUFBLENBQUFDLGFBQUEsQ0FBQ0MsZ0JBQUcsRUFBQTtFQUFDRSxJQUFBQSxPQUFPLEVBQUMsT0FBTztFQUFDRyxJQUFBQSxTQUFTLEVBQUMsTUFBQTtFQUFNLEdBQUEsZUFDbkNQLHNCQUFBLENBQUFDLGFBQUEsQ0FBQ1UsbUJBQU0sRUFBQTtFQUFDQyxJQUFBQSxPQUFPLEVBQUMsU0FBUztFQUFDQyxJQUFBQSxPQUFPLEVBQUVqQixjQUFBQTtFQUFlLEdBQUEsRUFBQyxVQUUzQyxDQUNMLENBQ0UsQ0FDTixDQUFDLENBQUE7RUFFVixDQUFDOztFQzFERGtCLE9BQU8sQ0FBQ0MsY0FBYyxHQUFHLEVBQUUsQ0FBQTtFQUUzQkQsT0FBTyxDQUFDQyxjQUFjLENBQUNwQixTQUFTLEdBQUdBLFNBQVM7Ozs7OzsifQ==
