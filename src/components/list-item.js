import React from "react";

export default class ListItem extends React.Component {
    render () {
        const { Name, Price, Weight, isChecked } = this.props;
        return (
            <tr className={"item-" + (isChecked ? "Checked" : "not-Checked") }>
                <td>{Name}</td>
                <td>{Price}</td>
                <td>{Weight}</td>
                <td>{(isChecked ?  <input type="checkbox" value={Name} onClick={this.toggleTask.bind(this)} checked /> :
                    <input type="checkbox" value={Name} onClick={this.toggleTask.bind(this)} unchecked /> )}</td>
            </tr>
        )
    }

    toggleTask () {
        this.props.toggleItem(this.props.id);
    }
}
