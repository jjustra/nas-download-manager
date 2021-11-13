import "./fatal-error.scss";
import * as React from "react";

import { NonIdealState } from "../common/components/NonIdealState";
import { BUG_REPORT_URL } from "../common/constants";
import { redactState, Settings } from "../common/state";
import type { Downloads } from "../common/apis/messages";

export interface Props {
  error: unknown;
  errorInfo?: React.ErrorInfo | undefined;
  settings?: Settings;
  downloads?: Downloads;
}

export class FatalError extends React.PureComponent<Props, {}> {
  render() {
    let redactedState;

    try {
      redactedState = redactState(this.props.settings, this.props.downloads);
    } catch (e) {
      redactedState = undefined;
    }

    const formattedError =
      this.props.error instanceof Error
        ? `${this.props.error.name}: '${this.props.error.message}'\n${
            this.props.error.stack
              ? "Error stack trace: " + this.props.error.stack.trim()
              : "(no Error stack)"
          }`
        : JSON.stringify(this.props.error, null, 2);

    const formattedDebugLogs = `${
      redactedState
        ? "Redacted extension state: " + JSON.stringify(redactedState, null, 2)
        : "(no state provided)"
    }

${formattedError}

${
  this.props.errorInfo
    ? "React stack trace:" + this.props.errorInfo.componentStack
    : "(no React stack)"
}`;
    return (
      <div className="popup fatal-error">
        <NonIdealState
          icon="fa-exclamation-triangle"
          text={browser.i18n.getMessage("Unknown_error_displaying_tasks")}
        >
          <span className="further-explanation">
            {browser.i18n.getMessage("Your_download_tasks_are_not_affected")}
          </span>
          <span className="further-explanation">
            {browser.i18n.getMessage("Please_")}
            <a href={BUG_REPORT_URL}>{browser.i18n.getMessage("file_a_bug")}</a>
            {browser.i18n.getMessage("_and_include_the_information_below")}
          </span>
          <textarea
            value={formattedDebugLogs}
            readOnly={true}
            onClick={(e) => {
              e.currentTarget.select();
            }}
          />
        </NonIdealState>
      </div>
    );
  }
}
