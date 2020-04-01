import React from "react";
import ListItemHeader from "./list-header";
import ListItem from "./list-item";

export default class List extends React.Component {
    renderItems () {
        return this.props.items.map((c, index) => {
            return (
                <ListItem
                    key={index}
                    {...c}
                    id={index}
                    toggleItem={this.props.toggleItem}
                />
            )
        });
    }
    render () {
        if (!this.props.items.length) {
            return <p className="tutorial">Product not available!</p>;
        }
        return (
            <table>
                <ListItemHeader />
                <tbody>
                    {this.renderItems()}
                </tbody>
            </table>
        )
    }
}
