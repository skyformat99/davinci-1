import * as React from 'react'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { FilterTypes, FilterTypesViewSetting } from './filterTypes'

const Input = require('antd/lib/input')
const InputNumber = require('antd/lib/input-number')
const Select = require('antd/lib/select')
const Option = Select.Option
const DatePicker = require('antd/lib/date-picker')
const RangePicker = DatePicker.RangePicker
const Form = require('antd/lib/form')
const FormItem = Form.Item

const styles = require('./filter.less')

import NumberRange from '../NumberRange'
import MultiDatePicker from '../MultiDatePicker'

interface IFilterControlProps {
  formToAppend: WrappedFormUtils
  filter: any
  onGetOptions: (fromViewId, fromModelName, filterKey) => void
  currentOptions: any[]
  onChange: (filter, val) => void
}

export class FilterControl extends React.Component<IFilterControlProps, {}> {

  public componentWillMount () {
    this.loadOptions()
  }

  public componentWillReceiveProps (nextProps: IFilterControlProps) {
    const { filter } = nextProps
    if (filter && filter !== this.props.filter) {
      this.loadOptions()
    }
  }

  private loadOptions = () => {
    const { filter, onGetOptions } = this.props
    if (!filter) { return }
    const { type } = filter
    if (!FilterTypesViewSetting[type]) { return } // @TODO 固定过滤项处理
    const { key, fromView, fromModel } = filter
    onGetOptions(fromView, fromModel, key)
  }

  private renderInputText = (filter, onChange) => {
    return (
      <Input placeholder={filter.name} onChange={onChange} />
    )
  }

  private renderInputNumber = (filter, onChange) => {
    return (
      <InputNumber placeholder={filter.name} onChange={onChange} />
    )
  }

  private renderNumberRange = (filter, onChange) => {
    return (
      <NumberRange placeholder={filter.name} onSearch={onChange} />
    )
  }

  private renderSelect = (filter, onChange, options) => {
    return (
      <Select allowClear={true} placeholder={filter.name} onChange={onChange}>
        {options.map((opt) => (<Option key={opt} value={opt}>{opt}</Option>))}
      </Select>
    )
  }

  private renderMultiSelect = (filter, onChange, options) => {
    return (
      <Select mode="multiple" placeholder={filter.name} onChange={onChange}>
        {options.map((opt) => (<Option key={opt} value={opt}>{opt}</Option>))}
      </Select>
    )
  }

  private renderCascadeSelect = () => {
    return void 0 // @TODO cascade select
  }

  private renderInputDate = (filter, onChange) => {
    return (
      <DatePicker placeholder={filter.name} format="YYYY-MM-DD" onChange={onChange}/>
    )
  }

  private renderMultiDate = (filter, onChange) => {
    return (
      <MultiDatePicker placeholder={filter.name} onChange={onChange} />
    )
  }

  private renderDateRange = (filter, onChange) => {
    const placeholder = [`${filter.name}从`, '到']
    return (
      <RangePicker format="YYYY-MM-DD" placeholder={placeholder} onChange={onChange} />
    )
  }

  private renderDatetime = (filter, onChange) => {
    const change = (val) => {
      if (!val.length) {
        onChange(val)
      }
    }
    return (
      <DatePicker
        placeholder={filter.name}
        format="YYYY-MM-DD HH:mm:ss"
        showTime={true}
        onOk={onChange}
        onChange={change}
      />
    )
  }

  private renderDatetimeRange = (filter, onChange) => {
    const placeholder = [`${filter.name}从`, '到']
    const change = (val) => {
      if (!val.length) {
        onChange(val)
      }
    }
    return (
      <RangePicker
        placeholder={placeholder}
        format="YYYY-MM-DD HH:mm:ss"
        showTime={true}
        onOk={onChange}
        onChange={change}
      />
    )
  }

  private wrapFormItem = (filter, form: WrappedFormUtils, control) => {
    const { getFieldDecorator } = form
    return (
      <FormItem className={styles.item}>
        {getFieldDecorator(filter.key, {})(control)}
      </FormItem>
    )
  }

  private renderControl = (filter, onChange) => {
    const { currentOptions, formToAppend } = this.props
    let control
    switch (filter.type) {
      case FilterTypes.InputText:
        control = this.renderInputText(filter, onChange)
        break
      case FilterTypes.InputNumber:
        control = this.renderInputNumber(filter, onChange)
        break
      case FilterTypes.NumberRange:
        control = this.renderNumberRange(filter, onChange)
        break
      case FilterTypes.Select:
        control = this.renderSelect(filter, onChange, currentOptions)
        break
      case FilterTypes.MultiSelect:
        control = this.renderMultiSelect(filter, onChange, currentOptions)
        break
      case FilterTypes.CascadeSelect:
        control = this.renderCascadeSelect()
        break
      case FilterTypes.InputDate:
        control = this.renderInputDate(filter, onChange)
        break
      case FilterTypes.MultiDate:
        control = this.renderMultiDate(filter, onChange)
        break
      case FilterTypes.DateRange:
        control = this.renderDateRange(filter, onChange)
        break
      case FilterTypes.Datetime:
        control = this.renderDatetime(filter, onChange)
        break
      case FilterTypes.DatetimeRange:
        control = this.renderDatetimeRange(filter, onChange)
        break
    }
    return this.wrapFormItem(filter, formToAppend, control)
  }

  private change = (val) => {
    const { filter, onChange } = this.props
    onChange(filter, val)
  }

  public render () {
    const { filter } = this.props
    return this.renderControl(filter, this.change)
  }
}

export default FilterControl