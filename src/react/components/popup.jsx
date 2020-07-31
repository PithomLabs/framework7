import React, { forwardRef, useRef, useImperativeHandle, useLayoutEffect } from 'react';
import { classNames, getDataAttrs, emit } from '../shared/utils';
import { colorClasses } from '../shared/mixins';
import { f7ready, f7 } from '../shared/f7';
import { watchProp } from '../shared/watch-prop';

/* dts-imports
import { Popup } from 'framework7/types';
*/

/* dts-props
  id?: string | number;
  className?: string;
  style?: React.CSSProperties;
  tabletFullscreen? : boolean
  opened? : boolean
  animate? : boolean
  backdrop? : boolean
  backdropEl? : string | Object
  closeByBackdropClick? : boolean
  closeOnEscape? : boolean
  swipeToClose? : boolean | string
  swipeHandler? : string | Object
  push? : boolean
  COLOR_PROPS
  onPopupSwipeStart? : (instance?: Popup.Popup) => void
  onPopupSwipeMove? : (instance?: Popup.Popup) => void
  onPopupSwipeEnd? : (instance?: Popup.Popup) => void
  onPopupSwipeClose? : (instance?: Popup.Popup) => void
  onPopupOpen? : (instance?: Popup.Popup) => void
  onPopupOpened? : (instance?: Popup.Popup) => void
  onPopupClose? : (instance?: Popup.Popup) => void
  onPopupClosed? : (instance?: Popup.Popup) => void
*/

const Popup = forwardRef((props, ref) => {
  const f7Popup = useRef(null);
  const {
    className,
    id,
    style,
    children,
    tabletFullscreen,
    push,
    opened,
    closeByBackdropClick,
    backdrop,
    backdropEl,
    animate,
    closeOnEscape,
    swipeToClose = false,
    swipeHandler,
  } = props;
  const dataAttrs = getDataAttrs(props);

  const elRef = useRef(null);

  const onSwipeStart = (instance) => {
    emit(props, 'popupSwipeStart', instance);
  };
  const onSwipeMove = (instance) => {
    emit(props, 'popupSwipeMove', instance);
  };
  const onSwipeEnd = (instance) => {
    emit(props, 'popupSwipeEnd', instance);
  };
  const onSwipeClose = (instance) => {
    emit(props, 'popupSwipeClose', instance);
  };
  const onOpen = (instance) => {
    emit(props, 'popupOpen', instance);
  };
  const onOpened = (instance) => {
    emit(props, 'popupOpened', instance);
  };
  const onClose = (instance) => {
    emit(props, 'popupClose', instance);
  };
  const onClosed = (instance) => {
    emit(props, 'popupClosed', instance);
  };
  const open = (anim) => {
    if (!f7Popup.current) return undefined;
    return f7Popup.current.open(anim);
  };
  const close = (anim) => {
    if (!f7Popup.current) return undefined;
    return f7Popup.current.close(anim);
  };

  useImperativeHandle(ref, () => ({
    el: elRef.current,
    f7Popup: () => f7Popup.current,
    open,
    close,
  }));

  watchProp(opened, (value) => {
    if (!f7Popup.current) return;
    if (value) {
      f7Popup.current.open();
    } else {
      f7Popup.current.close();
    }
  });

  const onMount = () => {
    if (!elRef.current) return;
    const popupParams = {
      el: elRef.current,
      on: {
        swipeStart: onSwipeStart,
        swipeMove: onSwipeMove,
        swipeEnd: onSwipeEnd,
        swipeClose: onSwipeClose,
        open: onOpen,
        opened: onOpened,
        close: onClose,
        closed: onClosed,
      },
    };

    if ('closeByBackdropClick' in props) popupParams.closeByBackdropClick = closeByBackdropClick;
    if ('closeOnEscape' in props) popupParams.closeOnEscape = closeOnEscape;
    if ('animate' in props) popupParams.animate = animate;
    if ('backdrop' in props) popupParams.backdrop = backdrop;
    if ('backdropEl' in props) popupParams.backdropEl = backdropEl;
    if ('swipeToClose' in props) popupParams.swipeToClose = swipeToClose;
    if ('swipeHandler' in props) popupParams.swipeHandler = swipeHandler;

    f7ready(() => {
      f7Popup.current = f7.popup.create(popupParams);
      if (opened) {
        f7Popup.current.open(false);
      }
    });
  };

  const onDestroy = () => {
    if (f7Popup.current) {
      f7Popup.current.destroy();
    }
    f7Popup.current = null;
  };

  useLayoutEffect(() => {
    onMount();
    return onDestroy;
  }, []);

  const classes = classNames(
    className,
    'popup',
    {
      'popup-tablet-fullscreen': tabletFullscreen,
      'popup-push': push,
    },
    colorClasses(props),
  );

  return (
    <div id={id} style={style} className={classes} ref={elRef} {...dataAttrs}>
      {children}
    </div>
  );
});

Popup.displayName = 'f7-popup';

export default Popup;