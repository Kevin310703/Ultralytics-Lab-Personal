import torch
import math

def wiou_loss(pred_boxes, target_boxes, anchor_points=None, version='v1'):
    """
    Wise-IoU Loss
    pred_boxes: (bs, n_anchors, 4) dạng xyxy
    target_boxes: (bs, n_anchors, 4)
    """
    eps = 1e-7
    
    # Tính IoU
    lt = torch.max(pred_boxes[..., :2], target_boxes[..., :2])
    rb = torch.min(pred_boxes[..., 2:], target_boxes[..., 2:])
    wh = (rb - lt).clamp(min=0)
    inter = wh[..., 0] * wh[..., 1]
    area1 = (pred_boxes[..., 2] - pred_boxes[..., 0]) * (pred_boxes[..., 3] - pred_boxes[..., 1])
    area2 = (target_boxes[..., 2] - target_boxes[..., 0]) * (target_boxes[..., 3] - target_boxes[..., 1])
    union = area1 + area2 - inter + eps
    iou = inter / union

    # Khoảng cách tâm
    c_pred = (pred_boxes[..., :2] + pred_boxes[..., 2:]) / 2
    c_target = (target_boxes[..., :2] + target_boxes[..., 2:]) / 2
    rho2 = ((c_pred - c_target) ** 2).sum(-1)

    # Đường chéo bao
    lt_c = torch.min(pred_boxes[..., :2], target_boxes[..., :2])
    rb_c = torch.max(pred_boxes[..., 2:], target_boxes[..., 2:])
    c2 = ((rb_c - lt_c) ** 2).sum(-1) + eps

    if version == 'v1':
        # WIoU v1 (không attention)
        wiou = rho2 / c2 - iou
    else:
        # WIoU v2/v3 có attention (optional)
        with torch.no_grad():
            L_iou = 1.0 - iou
            beta = L_iou / (L_iou.mean() + eps)
            r = beta.detach()
        wiou = r * (rho2 / c2) - iou

    return wiou.mean()