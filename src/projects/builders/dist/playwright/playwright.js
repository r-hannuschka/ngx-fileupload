"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var architect_1 = require("@angular-devkit/architect");
var child_process_1 = require("child_process");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
function playwrightBuilder(options, context) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var target, server, serverResult, playwrightCommand, playwrightArgs, playwrightResult, playwrightProcess;
        var _this = this;
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context.logger.info('start dev server');
                    target = (0, architect_1.targetFromTargetString)(options.devServerTarget);
                    return [4 /*yield*/, context.scheduleTarget(target)];
                case 1:
                    server = _a.sent();
                    return [4 /*yield*/, server.result];
                case 2:
                    serverResult = _a.sent();
                    if (!serverResult.success) {
                        return [2 /*return*/, serverResult];
                    }
                    playwrightCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
                    playwrightArgs = ['playwright', 'test', '--config=e2e/playwright.conf.ts'];
                    playwrightResult = new rxjs_1.Subject();
                    playwrightProcess = (0, child_process_1.spawn)(playwrightCommand, playwrightArgs, {
                        stdio: 'inherit'
                    });
                    playwrightProcess.on('exit', function () { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                        return (0, tslib_1.__generator)(this, function (_a) {
                            playwrightResult.next({ success: true, error: '' });
                            playwrightResult.complete();
                            return [2 /*return*/];
                        });
                    }); });
                    playwrightProcess.on('error', function (error) {
                        playwrightResult.next({ success: false, error: error.message });
                        playwrightResult.complete();
                    });
                    playwrightResult.pipe((0, operators_1.finalize)(function () { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () { return (0, tslib_1.__generator)(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, server.stop()];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); }));
                    return [2 /*return*/, (0, rxjs_1.lastValueFrom)(playwrightResult)];
            }
        });
    });
}
// create builder
exports["default"] = (0, architect_1.createBuilder)(playwrightBuilder);
